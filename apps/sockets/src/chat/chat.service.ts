import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreateFriendChatting,
  OneOnOneChattingLog,
  RoomDataLog,
  WorldChattingLog,
} from '@libs/mongodb';
import { CreateFriendChattingRoom } from '@libs/mongodb';
import { ChattingMemberInfo } from '@libs/mongodb';
import { CommonService } from '@libs/common';
import { Repository } from 'typeorm';
import { Member } from '@libs/entity';
import { InjectRepository } from '@nestjs/typeorm';
import moment from 'moment-timezone';
import { NatsMessageHandler } from '../nats/nats-message.handler';
import {
  CHAT_SOCKET_C_MESSAGE,
  CHAT_SOCKET_S_MESSAGE,
  NATS_EVENTS,
  RedisKey,
  SOCKET_SERVER_ERROR_CODE_GLOBAL,
  SOCKET_S_GLOBAL,
} from '@libs/constants';
import { RequestPayload } from '../packets/packet-interface';
import {
  C_SEND_DIRECT_MESSAGE,
  C_SEND_MESSAGE,
  S_SEND_DIRECT_MESSAGE,
  S_SEND_MESSAGE,
} from '../packets/packet';
import { CustomSocket } from '../interfaces/custom-socket';
import { RedisFunctionService } from '@libs/redis';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  constructor(
    @InjectRedis() private readonly redisClient: Redis,
    @InjectModel('createFriendChattingRoom')
    private readonly createFriendChattingRoom: Model<CreateFriendChattingRoom>,
    @InjectModel('createFriendChatting')
    private readonly createFriendChatting: Model<CreateFriendChatting>,
    @InjectModel('chattingMemberInfo')
    private readonly chattingMemberInfo: Model<ChattingMemberInfo>,
    @InjectModel('worldChattingLog')
    private readonly worldChattingLog: Model<WorldChattingLog>,
    @InjectModel('oneononeChattingLog')
    private readonly oneononeChattingLog: Model<OneOnOneChattingLog>,
    @InjectModel('roomDataLog')
    private readonly roomDataLog: Model<RoomDataLog>,
    @InjectRepository(Member) private memberRepository: Repository<Member>,
    private readonly messageHandler: NatsMessageHandler,
    private readonly commonService: CommonService,
    private readonly redisFunctionService: RedisFunctionService,
  ) {}

  private server: Server;
  setServer(server: Server) {
    this.server = server;
  }

  async handleRequestMessage(client: CustomSocket, payload: RequestPayload) {
    switch (payload.eventName) {
      case CHAT_SOCKET_C_MESSAGE.C_SEND_MESSAGE:
        await this.sendMessage(client, payload.data);
        break;
      case CHAT_SOCKET_C_MESSAGE.C_SEND_DIRECT_MESSAGE:
        await this.sendDirectMessage(client, payload.data);
        break;
      case CHAT_SOCKET_C_MESSAGE.C_SEND_FRIEND_DIRECT_MESSAGE:
        await this.sendFriendDirectMessage(client, payload.data);
        break;
      default:
        this.logger.debug('잘못된 패킷 입니다.');
        client.emit(SOCKET_S_GLOBAL.ERROR, '잘못된 패킷 입니다.');
        break;
    }
  }

  // 메세지 보내기
  async sendMessage(client: CustomSocket, packet: C_SEND_MESSAGE) {
    const nickname = client.data.nickname;
    const memberId = client.data.memberId;
    const clientId = client.data.clientId;

    client.data.roomCode = packet.roomCode || null;

    const kstCreatedAt = moment.tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');
    const worldChattingLogSave = await new this.worldChattingLog({
      memberId: memberId,
      memberCode: clientId,
      nickName: nickname,
      roomCode: packet.roomCode,
      roomName: packet.roomName, // 룸코드가 안넘어올 수 있어서 안될 수 있으니 테스트 해봐야함
      roomId: client.data.roomId,
      chatMessage: packet.message,
      kstCreatedAt: kstCreatedAt,
    });
    await worldChattingLogSave.save();

    const request = new S_SEND_MESSAGE();
    request.message = packet.message;
    request.color = packet.color;
    request.sendNickname = nickname;

    const data = {
      redisRoomId: client.data.roomId,
      packet: request,
    };
    this.messageHandler.publishHandler(
      `${NATS_EVENTS.CHAT_ROOM}:${client.data.roomId}`,
      JSON.stringify(data),
    );
  }

  async broadcastMessage(data) {
    const redisRoomId = data.redisRoomId;
    const packet = data.packet;

    const { eventName, ...packetData } = packet;

    this.server.to(redisRoomId).emit(eventName, JSON.stringify(packetData));
  }

  // 귓소말 보내기
  async sendDirectMessage(client: CustomSocket, packet: C_SEND_DIRECT_MESSAGE) {
    if (!packet.recvNickname) {
      return client.emit(
        CHAT_SOCKET_S_MESSAGE.S_SYSTEM_MESSAGE,
        SOCKET_SERVER_ERROR_CODE_GLOBAL.DIRECT_MESSAGE_USER_NOT_FOUND,
      );
    }

    const recvMember = await this.memberRepository.findOne({
      where: {
        nickname: packet.recvNickname,
      },
    });

    // 귓속말 대상이 존재하지 않는 사용자일 경우
    if (!recvMember) {
      return client.emit(
        CHAT_SOCKET_S_MESSAGE.S_SYSTEM_MESSAGE,
        SOCKET_SERVER_ERROR_CODE_GLOBAL.DIRECT_MESSAGE_USER_NOT_FOUND,
      );
    }

    // 귓속말 대상이 현재 오프라인일 경우
    const targetSocket = await this.redisClient.get(
      RedisKey.getStrMemberSocket(recvMember.id),
    );

    if (!targetSocket) {
      return client.emit(
        CHAT_SOCKET_S_MESSAGE.S_SYSTEM_MESSAGE,
        SOCKET_SERVER_ERROR_CODE_GLOBAL.DIRECT_MESSAGE_USER_NOT_CONNECTED,
      );
    }

    const sendMember = await this.memberRepository.findOne({
      where: {
        id: client.data.memberId,
      },
    });

    // 본인에게 귓속말 보냈을 경우
    if (sendMember.id == recvMember.id) {
      return client.emit(
        CHAT_SOCKET_S_MESSAGE.S_SYSTEM_MESSAGE,
        SOCKET_SERVER_ERROR_CODE_GLOBAL.DIRECT_MESSAGE_SEND_ME,
      );
    }

    const kstCreatedAt = moment.tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');
    // mongodb 채팅 로그 저장
    const oneononeChattingLogSave = await new this.oneononeChattingLog({
      sendMemberId: sendMember.id,
      sendNickname: sendMember.nickname,
      recvMemberId: recvMember.id,
      recvNickname: recvMember.nickname,
      chatMessage: packet.message,
      kstCreatedAt: kstCreatedAt,
    });
    await oneononeChattingLogSave.save();

    const response = new S_SEND_DIRECT_MESSAGE();
    response.sendNickname = sendMember.nickname;
    response.recvNickname = recvMember.nickname;
    response.message = packet.message;
    response.color = packet.color;

    const { eventName, ...packetData } = response;
    client.emit(eventName, JSON.stringify(packetData));

    const data = {
      recvMemberId: recvMember.id,
      packet: response,
    };
    this.messageHandler.publishHandler(recvMember.id, JSON.stringify(data));
  }

  // 귓속말 대상자에게 전송
  async sendToReceiverDirectMessage(message) {
    const data = JSON.parse(message);
    const recvMemberId = data.recvMemberId;
    const packet = data.packet;

    const { eventName, ...packetData } = packet;

    this.server.to(recvMemberId).emit(eventName, JSON.stringify(packetData));
  }

  // // 월드 귓속말 특정 소켓에만 메세지 전송
  // async sendDirectMessage(client: CustomSocket, payload: any) {
  //   if (!payload.recvNickName) {
  //     return client.emit(
  //       CHAT_SOCKET_S_MESSAGE.S_SYSTEM_MESSAGE,
  //       SOCKET_SERVER_ERROR_CODE_GLOBAL.DIRECT_MESSAGE_USER_NOT_FOUND,
  //     );
  //   }

  //   const recvNickNameMember = await this.memberRepository.findOne({
  //     where: {
  //       nickname: payload.recvNickName,
  //     },
  //   });

  //   // 귓속말 대상이 존재하지 않는 사용자일 경우
  //   if (!recvNickNameMember) {
  //     return client.emit(
  //       CHAT_SOCKET_S_MESSAGE.S_SYSTEM_MESSAGE,
  //       SOCKET_SERVER_ERROR_CODE_GLOBAL.DIRECT_MESSAGE_USER_NOT_FOUND,
  //     );
  //   }

  //   // 귓속말 대상이 현재 오프라인일 경우
  //   const targetSocket = await this.redisClient.get(
  //     RedisKey.getStrMemberSocket(recvNickNameMember.memberId),
  //   );

  //   const sendNickNameMember = await this.memberRepository.findOne({
  //     where: {
  //       memberId: client.data.memberId,
  //     },
  //   });

  //   // 본인에게 귓속말 보냈을 경우
  //   if (sendNickNameMember.nickname == recvNickNameMember.nickname) {
  //     return client.emit(
  //       CHAT_SOCKET_S_MESSAGE.S_SYSTEM_MESSAGE,
  //       SOCKET_SERVER_ERROR_CODE_GLOBAL.DIRECT_MESSAGE_SEND_ME,
  //     );
  //   }

  //   // 귓속말 대상이 현재 오프라인일 경우
  //   if (!targetSocket) {
  //     return client.emit(
  //       CHAT_SOCKET_S_MESSAGE.S_SYSTEM_MESSAGE,
  //       SOCKET_SERVER_ERROR_CODE_GLOBAL.DIRECT_MESSAGE_USER_NOT_CONNECTED,
  //     );
  //   }

  //   const kstCreatedAt = moment.tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');
  //   // mongodb 채팅 로그 저장
  //   const oneononeChattingLogSave = await new this.oneononeChattingLog({
  //     sendMemberId: sendNickNameMember.memberId,
  //     sendNickName: sendNickNameMember.nickname,
  //     recvMemberId: recvNickNameMember.memberId,
  //     recvNickName: recvNickNameMember.nickname,
  //     chatMessage: payload.message,
  //     kstCreatedAt: kstCreatedAt,
  //   });
  //   await oneononeChattingLogSave.save();

  //   const recvmessageInfo = {
  //     sendNickName: sendNickNameMember.nickname,
  //     recvNickName: recvNickNameMember.nickname,
  //     message: payload.message,
  //     color: payload.color,
  //   };

  //   const sendMessageInfo = {
  //     recvNickName: recvNickNameMember.nickname,
  //     message: payload.message,
  //     color: payload.color,
  //   };

  //   const sendMessages = {
  //     recvmessageInfo,
  //     sendMessageInfo,
  //   };

  //   this.messageHandler.publishHandler(
  //     recvNickNameMember.memberId,
  //     JSON.stringify(sendMessages),
  //   );

  //   client.emit(
  //     CHAT_SOCKET_S_MESSAGE.S_SEND_DIRECT_MESSAGE,
  //     JSON.stringify(sendMessageInfo),
  //   );
  // }

  // 친구 채팅 방 만들기
  async createFriendDirectMessageRooms(
    client: CustomSocket,
    targetMemberId: any,
  ) {
    const memberId = client['data'].memberId;
    const roomId = uuidv4();

    const newChattingRoom = await new this.createFriendChattingRoom({
      roomId: roomId,
      memberIds: [memberId, targetMemberId],
    });

    await newChattingRoom.save();

    // 본인 정보에 방 추가
    const existingMemberChattingRoomInfo =
      await this.chattingMemberInfo.findOne({ memberId: memberId });
    if (existingMemberChattingRoomInfo) {
      // 문서가 존재할 경우, 해당 문서의 rooms 필드에 roomId를 추가합니다.
      existingMemberChattingRoomInfo.rooms.push(roomId);

      // 변경된 정보를 저장합니다.
      await existingMemberChattingRoomInfo.save();

      console.log(
        `Member ${memberId}'s rooms updated: `,
        existingMemberChattingRoomInfo,
      );
    } else {
      const newMemberChattingRoomInfo = await new this.chattingMemberInfo({
        memberId: memberId,
        rooms: [roomId],
      });
      await newMemberChattingRoomInfo.save();
    }

    // 상대 정보에 방 추가
    const existingTargetMemberChattingRoomInfo =
      await this.chattingMemberInfo.findOne({ memberId: targetMemberId });
    if (existingTargetMemberChattingRoomInfo) {
      // 문서가 존재할 경우, 해당 문서의 rooms 필드에 roomId를 추가합니다.
      existingTargetMemberChattingRoomInfo.rooms.push(roomId);

      // 변경된 정보를 저장합니다.
      await existingTargetMemberChattingRoomInfo.save();

      console.log(
        `Member ${targetMemberId}'s rooms updated: `,
        existingTargetMemberChattingRoomInfo,
      );
    } else {
      const newTargetMemberChattingRoomInfo = await new this.chattingMemberInfo(
        {
          memberId: targetMemberId,
          rooms: [roomId],
        },
      );
      await newTargetMemberChattingRoomInfo.save();
    }

    return roomId;
  }

  // 친구에게 다이렉트 메세지 전송
  async sendFriendDirectMessage(client: CustomSocket, payload: any) {
    const memberId = client['data'].memberId;

    const messageId = uuidv4();

    const findChattingRoom = await this.createFriendChattingRoom.findOne({
      $and: [{ memberIds: memberId }, { memberIds: payload.targetMemberId }],
    });

    console.log('채팅 룸을 찾아볼게요');
    console.log(findChattingRoom);
    // 채팅 방이 없으면 채팅 방 만들기
    if (findChattingRoom === null) {
      const room = await this.createFriendDirectMessageRooms(
        client,
        payload.targetMemberId,
      );

      console.log('룸 만든다~~~~~~~');
      console.log(room);
      const newChatting = await new this.createFriendChatting({
        messageId: messageId,
        roomId: room,
        memberId: memberId,
        message: payload.message,
        unReadMembers: [payload.targetMemberId],
      });
      await newChatting.save();
    } else {
      console.log('채팅 룸을 찾았어요');
      console.log(findChattingRoom);

      const roomId = findChattingRoom.roomId;
      console.log('채팅 룸 아이디 ^^');
      console.log(roomId);
      const newChatting = await new this.createFriendChatting({
        messageId: messageId,
        roomId: roomId,
        memberId: memberId,
        message: payload.message,
        unReadMembers: [payload.targetMemberId],
      });
      await newChatting.save();
    }

    client.emit(
      CHAT_SOCKET_S_MESSAGE.S_SEND_FRIEND_DIRECT_MESSAGE,
      `[DM]${payload.targetMemberId}에게 보낸 메세지:${payload.message}`,
    );

    // 특정 방에 접속해있는 특정 소켓에게만 메세지 전송
    client
      .to(payload.targetMemberId)
      .emit(
        CHAT_SOCKET_S_MESSAGE.S_SEND_FRIEND_DIRECT_MESSAGE,
        `[DM]${client['data'].memberId}가 보낸 메세지 :${payload.message}`,
      );

    console.log('저장했옹');
  }

  // 친구 채팅 매세지 리스트 가져오기
  async getFriendDirectMessageList(client: CustomSocket) {
    const memberId = client['data'].memberId;

    // 채팅방 목록
    const chattingList = [];

    // 접속 중인 채팅방 전체 불러오기
    const findChattingRoom = await this.chattingMemberInfo.find({
      memberId: memberId,
    });

    const member = await this.memberRepository.findOne({
      where: {
        id: memberId,
      },
    });

    // 아바타 정보를 조회
    const avatarInfo = await this.commonService.getMemberAvatarInfo(
      member.memberCode,
    );

    // 방에 있는 마지막 채팅 내용 하나씩만 불러오기
    if (findChattingRoom && findChattingRoom.length > 0) {
      for (let i = 0; i < findChattingRoom[0].rooms.length; i++) {
        console.log('방에 있는 채팅 내용 불러오기');
        console.log(findChattingRoom[0].rooms[i]);

        //createdAt 기준으로 내림차순 정렬 후, limit 1개만 가져오기
        const findChatting = await this.createFriendChatting
          .find({
            roomId: findChattingRoom[0].rooms[i],
          })
          .sort({ createdAt: -1 })
          .limit(1);

        //채팅 내용
        console.log(findChatting);

        //findChattting 내에 있는 unreadMembers 배열에 memberId가 있는지 개수만큼 확인
        //안읽은 매세지 개수 확인
        const findUnreadChatting = await this.createFriendChatting.find({
          roomId: findChattingRoom[0].rooms[i],
          unReadMembers: { $in: [memberId] },
        });

        chattingList.push({
          chattingList: findChatting,
          unReadCount: findUnreadChatting.length,
          avatarInfo: avatarInfo,
        });
      }
      return chattingList;
    }
  }

  // 친구 다이렉트 매세지 가져오기
  async getFriendDirectMessage(client: CustomSocket, roomId: string) {
    //테스트를 위해 임의로 DTO 상수 선언
    const paginationDto = {
      page: 1,
      limit: 10,
    };

    const page = paginationDto.page ? paginationDto.page : 1;
    const limit = paginationDto.limit ? paginationDto.limit : 10;
    const skip = (page - 1) * limit;
    const findChatting = await this.createFriendChatting
      .find({
        roomId: roomId,
      })
      .skip(skip)
      .limit(limit);

    console.log('친구 채팅 내용 불러오기 페이지 네이션 ~ ~ ~~ ');
    console.log(findChatting);
  }

  // 채팅 방 나가기
  async exitChatRoom(client: CustomSocket, roomId: string) {
    this.logger.debug('채팅 방 퇴장 이벤트 발생 : ' + roomId);
    const playerIds = await this.redisClient.smembers(
      RedisKey.getStrRoomPlayerList(roomId),
    );

    console.log(playerIds);

    // 룸에 사용자가 본인 1명 뿐이라면 룸 삭제
    if (playerIds.length === 1) {
      await this.redisClient.del(roomId);

      await this.messageHandler.publishHandler(
        NATS_EVENTS.DELETE_CHAT_ROOM,
        roomId,
      );
    }

    // 룸 사용자 리스트에서 사용자 정보 삭제
    await this.redisClient.srem(
      RedisKey.getStrRoomPlayerList(roomId),
      client.data.memberId,
    );

    await this.redisFunctionService.updateJson(
      RedisKey.getStrMemberSocket(client.data.memberId),
      'roomId',
      '',
    );

    // 기존 룸에서 사용자 제거
    const memberKey = RedisKey.getStrMemberCurrentRoom(client.data.memberId);
    await this.redisClient.del(memberKey);

    const kstCreatedAt = moment.tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');
    // 방 퇴장 로그 기록
    const roomDataLogArr = await new this.roomDataLog({
      memberId: client.data.memberId,
      nickName: client.data.nickname,
      roomName: client.data.roomName,
      roomCode: client.data.roomCode,
      description: '퇴장 ',
      kstCreatedAt: kstCreatedAt,
    });

    await roomDataLogArr.save();
    client.leave(roomId);

    client.data.roomName = '';
    client.data.roomCode = '';

    // 룸 퇴장 이벤트 발생
    await this.messageHandler.publishHandler(
      `${NATS_EVENTS.LEAVE_ROOM}:${client.data.memberId}`,
      JSON.stringify({
        memberId: client.data.memberId,
        roomId: client.data.roomId,
      }),
    );
  }

  // 방 가져오기
  async getChatRoom(client: CustomSocket, roomId: string) {
    if (
      !this.redisClient.get(roomId) ||
      this.redisClient.get(roomId) === undefined
    ) {
      return client.emit(
        CHAT_SOCKET_S_MESSAGE.S_SEND_MESSAGE,
        '알림 : 존재하지 않는 방입니다.',
      );
    }

    const room = await this.redisClient.get(roomId);

    return JSON.parse(room).roomName;
  }

  // 접속중인 사용자 닉네임 리스트 가져오기
  async getPlayerList(client: CustomSocket) {
    const playerList = await this.redisClient.keys('socket:*');
    const playerNickNameList = [];

    // playerList 순차적으로 조회하면서 닉네임만 추출

    for (const p of playerList) {
      const player = await this.redisClient.get(p);
      playerNickNameList.push(JSON.parse(player).nickname);
    }

    client.emit('GetConnectedClientList', JSON.stringify(playerNickNameList));
  }
}

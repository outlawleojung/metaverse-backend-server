import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { CommonService } from '@libs/common';
import { Member, MemberAvatarInfo, MemberFriend } from '@libs/entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Redis } from 'ioredis';
import { Server } from 'socket.io';
import { Repository } from 'typeorm';
import { NatsMessageHandler } from '../nats/nats-message.handler';
import {
  FRIEND_SOCKET_C_MESSAGE,
  NATS_EVENTS,
  RedisKey,
  SOCKET_S_GLOBAL,
  SOCKET_SERVER_ERROR_CODE_GLOBAL,
} from '@libs/constants';
import { RequestPayload } from '../packets/packet-interface';
import { CustomSocket } from '../interfaces/custom-socket';
import {
  C_FRIEND_BRING,
  C_FRIEND_FOLLOW,
  S_FRIEND_BRING,
  S_FRIEND_FOLLOW,
  S_FRIEND_LIST,
} from '../packets/friend-packet copy';

@Injectable()
export class FriendService {
  private readonly logger = new Logger(FriendService.name);
  constructor(
    @InjectRedis() private readonly redisClient: Redis,
    private readonly commonService: CommonService,
    @InjectRepository(Member) private memberRepository: Repository<Member>,
    @InjectRepository(MemberFriend)
    private memberFriendRepository: Repository<MemberFriend>,
    @InjectRepository(MemberAvatarInfo)
    private avatarRepository: Repository<MemberAvatarInfo>,
    private readonly messageHandler: NatsMessageHandler,
  ) {}

  private server: Server;
  async setServer(server: Server) {
    this.server = server;
  }

  async handleRequestMessage(client: CustomSocket, payload: RequestPayload) {
    switch (payload.eventName) {
      case FRIEND_SOCKET_C_MESSAGE.C_FRIEND_LIST:
        await this.getFriends(client);
        break;
      case FRIEND_SOCKET_C_MESSAGE.C_FRIEND_FOLLOW:
        await this.friendsFollow(client, payload.data);
        break;
      case FRIEND_SOCKET_C_MESSAGE.C_FRIEND_BRING:
        await this.friendsBring(client, payload.data);
        break;
      default:
        this.logger.debug('잘못된 패킷 입니다.');
        client.emit(SOCKET_S_GLOBAL.ERROR, '잘못된 패킷 입니다.');
        break;
    }
  }

  async getFriends(client: CustomSocket) {
    const memberId = client.data.memberId;
    try {
      const friends = await this.memberFriendRepository
        .createQueryBuilder('mf')
        .select([
          'm.memberId as friendMemberId',
          'm.memberCode as friendMemberCode',
          'm.nickname as friendNickname',
          'm.stateMessage as friendMessage',
          'mf.createdAt as createdAt',
          'mf.bookmark as bookmark',
          'mf.bookmarkedAt as bookmarkedAt',
        ])
        .innerJoin('member', 'm', 'm.memberId = mf.friendMemberId')
        .where('mf.memberId = :memberId', { memberId })
        .getRawMany();

      const packet = new S_FRIEND_LIST();

      // 2. 아바타 정보 조회
      const memberIds = friends.map((friend) => friend.friendMemberId);
      const avatarInfos = await this.avatarRepository
        .createQueryBuilder('avatar')
        .where('avatar.memberId IN (:...memberIds)', { memberIds })
        .getMany();

      // 아바타 정보 매핑
      const avatarMap = avatarInfos.reduce((acc, cur) => {
        if (!acc[cur.memberId]) acc[cur.memberId] = {};
        acc[cur.memberId][cur.avatarPartsType] = cur.itemId;
        return acc;
      }, {});

      // 3. Redis에서 온라인 여부 확인
      const onlineKeys = friends.map((friend) =>
        RedisKey.getStrMemberSocket(friend.friendMemberId),
      );
      const onlineStatuses = await this.redisClient.mget(...onlineKeys);

      // 4. 데이터 결합 및 포맷팅
      const enhancedFriends = friends.map((friend, index) => {
        return {
          ...friend,
          avatarInfos: avatarMap[friend.friendMemberId] || {},
          isOnline: onlineStatuses[index] !== null, // Redis에서 값이 있는 경우 온라인으로 간주
        };
      });

      packet.friends = enhancedFriends;
      const { eventName, ...packetData } = packet;

      return client.emit(eventName, packetData);
    } catch (err) {
      console.log(err);
    }
  }

  async friendsFollow(client: CustomSocket, data: C_FRIEND_FOLLOW) {
    // memberId가 존재하는지 확인
    const memberInfo = await this.memberRepository.findOne({
      where: {
        memberId: data.friendMemberId,
      },
    });

    const packet = new S_FRIEND_FOLLOW();

    //유저가 존재하지 않을 경우
    if (!memberInfo) {
      packet.code = SOCKET_SERVER_ERROR_CODE_GLOBAL.FRIEND_NOT_EXIST;
      const { eventName, ...packetData } = packet;

      return client.emit(eventName, packetData);
    }

    // 이미 친구인지 확인
    const memberFriendInfo = await this.memberFriendRepository.findOne({
      where: {
        memberId: client.data.memberId,
        friendMemberId: data.friendMemberId,
      },
    });

    // 친구가 아닐 경우
    if (!memberFriendInfo) {
      packet.code = SOCKET_SERVER_ERROR_CODE_GLOBAL.FRIEND_NOT_FRIEND;
      const { eventName, ...packetData } = packet;

      return client.emit(eventName, packetData);
    }

    //소켓 가져오기
    const socketInfo = await this.redisClient.get(
      RedisKey.getStrMemberSocket(data.friendMemberId),
    );

    //존재 하지 않을 경우 오프라인
    if (!socketInfo) {
      packet.code = SOCKET_SERVER_ERROR_CODE_GLOBAL.FRIEND_IS_OFFLINE;
      const { eventName, ...packetData } = packet;

      return client.emit(eventName, packetData);
    } else {
      {
        // 입장할 수 없을 경우
        packet.code = 40012;
        packet.roomId = JSON.parse(socketInfo).roomId;
        packet.sceneName = JSON.parse(socketInfo).sceneName;
        packet.memberCode = memberInfo.memberCode;
        packet.nickName = memberInfo.nickname;
        packet.myRoomStateType = memberInfo.myRoomStateType;

        const { eventName, ...packetData } = packet;

        // 입장할 수 없는 씬일 경우
        if (
          JSON.parse(socketInfo).sceneName === 'Scene_Room_JumpingMatching' &&
          JSON.parse(socketInfo).sceneName === 'Scene_Room_OXQuiz' &&
          JSON.parse(socketInfo).sceneName === 'Scene_Room_Lecture' &&
          JSON.parse(socketInfo).sceneName ===
            'Scene_Room_Lecture_22Christmas' &&
          JSON.parse(socketInfo).sceneName === 'Scene_Room_Meeting' &&
          JSON.parse(socketInfo).sceneName ===
            'Scene_Room_Meeting_22Christmas' &&
          JSON.parse(socketInfo).sceneName === 'Scene_Room_Meeting_Office' &&
          JSON.parse(socketInfo).sceneName === 'Scene_Room_Consulting'
        ) {
          return client.emit(eventName, packetData);
        }

        // 마이룸일 경우 권한 검사
        if (JSON.parse(socketInfo).sceneName === 'Scene_Room_MyRoom') {
          if (memberInfo.myRoomStateType === 4) {
            return client.emit(eventName, packetData);
          }
        }
      }
      {
        // 입장이 가능한 경우
        packet.code = SOCKET_SERVER_ERROR_CODE_GLOBAL.FRIEND_FOLLOW;
        packet.roomId = JSON.parse(socketInfo).roomId;
        packet.sceneName = JSON.parse(socketInfo).sceneName;
        packet.memberCode = memberInfo.memberCode;
        packet.nickName = memberInfo.nickname;
        packet.myRoomStateType = memberInfo.myRoomStateType;

        const { eventName, ...packetData } = packet;

        return client.emit(eventName, packetData);
      }
    }
  }

  async friendsBring(client: CustomSocket, data: C_FRIEND_BRING) {
    // memberId가 존재하는지 확인
    const friendMemberInfo = await this.memberRepository.findOne({
      where: {
        memberId: data.friendMemberId,
      },
    });

    const memberInfo = await this.memberRepository.findOne({
      where: {
        memberId: client.data.memberId,
      },
    });

    const packet = new S_FRIEND_BRING();

    //유저가 존재하지 않을 경우
    if (!friendMemberInfo) {
      packet.code = SOCKET_SERVER_ERROR_CODE_GLOBAL.FRIEND_NOT_EXIST;
      const { eventName, ...packetData } = packet;

      return client.emit(eventName, packetData);
    }

    // 이미 친구인지 확인
    const memberFriendInfo = await this.memberFriendRepository.findOne({
      where: {
        memberId: client.data.memberId,
        friendMemberId: data.friendMemberId,
      },
    });

    // 친구가 아닐 경우
    if (!memberFriendInfo) {
      packet.code = SOCKET_SERVER_ERROR_CODE_GLOBAL.FRIEND_NOT_FRIEND;
      const { eventName, ...packetData } = packet;

      return client.emit(eventName, packetData);
    }

    //소켓 가져오기
    const friendSocketInfo = await this.redisClient.get(
      RedisKey.getStrMemberSocket(data.friendMemberId),
    );

    //자신의 소켓 가져오기
    const socketInfo = await this.redisClient.get(
      RedisKey.getStrMemberSocket(client.data.memberId),
    );

    //존재 하지 않을 경우 오프라인
    if (!friendSocketInfo) {
      packet.code = SOCKET_SERVER_ERROR_CODE_GLOBAL.FRIEND_IS_OFFLINE;
      const { eventName, ...packetData } = packet;

      return client.emit(eventName, packetData);
    } else {
      {
        // 입장할 수 없을 경우
        packet.code = 40012;
        packet.roomId = JSON.parse(socketInfo).roomId;
        packet.sceneName = JSON.parse(socketInfo).sceneName;
        packet.memberCode = memberInfo.memberCode;
        packet.nickName = memberInfo.nickname;
        packet.myRoomStateType = memberInfo.myRoomStateType;

        const { eventName, ...packetData } = packet;

        // 입장할 수 없는 씬일 경우
        if (
          JSON.parse(socketInfo).sceneName === 'Scene_Room_JumpingMatching' &&
          JSON.parse(socketInfo).sceneName === 'Scene_Room_OXQuiz' &&
          JSON.parse(socketInfo).sceneName === 'Scene_Room_Lecture' &&
          JSON.parse(socketInfo).sceneName ===
            'Scene_Room_Lecture_22Christmas' &&
          JSON.parse(socketInfo).sceneName === 'Scene_Room_Meeting' &&
          JSON.parse(socketInfo).sceneName ===
            'Scene_Room_Meeting_22Christmas' &&
          JSON.parse(socketInfo).sceneName === 'Scene_Room_Meeting_Office' &&
          JSON.parse(socketInfo).sceneName === 'Scene_Room_Consulting'
        ) {
          return client.emit(eventName, packetData);
        }

        // 마이룸일 경우 권한 검사
        if (JSON.parse(socketInfo).sceneName === 'Scene_Room_MyRoom') {
          if (memberInfo.myRoomStateType === 4) {
            return client.emit(eventName, packetData);
          }
        }
      }
      {
        packet.code = SOCKET_SERVER_ERROR_CODE_GLOBAL.FRIEND_BRING;
        packet.roomId = JSON.parse(socketInfo).roomId;
        packet.sceneName = JSON.parse(socketInfo).sceneName;
        packet.memberCode = memberInfo.memberCode;
        packet.nickName = memberInfo.nickname;
        packet.myRoomStateType = memberInfo.myRoomStateType;

        const response = {
          friendMemberId: data.friendMemberId,
          packet,
        };

        this.messageHandler.publishHandler(
          data.friendMemberId,
          JSON.stringify(response),
        );
      }
    }
  }
  async sendTofriendsBring(message) {
    const data = JSON.parse(message);
    const friendMemberId = data.friendMemberId;

    const { eventName, ...packetData } = data.packet;

    this.server.to(friendMemberId).emit(eventName, packetData);
  }
}

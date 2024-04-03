import { TokenCheckService } from './auth/tocket-check.service';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Member } from '@libs/entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Redis } from 'ioredis';
import { Server, Socket } from 'socket.io';
import { Repository } from 'typeorm';
import { io } from 'socket.io-client';

import { RedisFunctionService } from '@libs/redis';
import axios from 'axios';
import {
  NATS_EVENTS,
  PLAYER_SOCKET_C_MESSAGE,
  RedisKey,
  SOCKET_SERVER_ERROR_CODE_GLOBAL,
  SOCKET_S_GLOBAL,
} from '@libs/constants';
import { NatsMessageHandler } from '../nats/nats-message.handler';
import { GameObjectService } from '../player/game/game-object.service';
import { RequestPayload } from '../packets/packet-interface';
import { C_ENTER, S_ENTER } from '../packets/packet';
import { HubSocketService } from '../hub-socket/hub-socket.service';
import { SubscribeService } from '../nats/subscribe.service';
import { RoomType } from '../room/room-type';
import { ClientService } from '../services/client.service';
import { CustomSocket } from '../interfaces/custom-socket';

@Injectable()
export class UnificationService {
  constructor(
    @InjectRedis() private readonly redisClient: Redis,
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
    private readonly gameObjectService: GameObjectService,
    private readonly redisFunctionService: RedisFunctionService,
    private readonly tokenCheckService: TokenCheckService,
    private readonly socketService: HubSocketService,
    private readonly subscribeService: SubscribeService,
    private readonly clientService: ClientService,
    private messageHandler: NatsMessageHandler,
  ) {}
  private readonly logger = new Logger(UnificationService.name);

  private server: Server;
  setServer(server: Server) {
    this.server = server;
  }

  //소켓 연결
  async handleConnection(server: Server, client: CustomSocket) {
    const authInfo =
      await this.tokenCheckService.getJwtAccessTokenAndSessionId(client);

    const jwtAccessToken = authInfo.jwtAccessToken;
    const sessionId = authInfo.sessionId;

    await this.tokenCheckService.checkTokenSession(
      client,
      authInfo.jwtAccessToken,
      authInfo.sessionId,
    );

    if (!client.data.memberId) {
      client.emit(SOCKET_S_GLOBAL.S_DROP_PLAYER, 10002);
      client.disconnect();
      return;
    }

    const memberInfo =
      await this.tokenCheckService.checkLoginToken(jwtAccessToken);

    const memberId = memberInfo.memberId;

    // 소켓 정보 조회
    const socketInfo = await this.redisClient.get(
      RedisKey.getStrMemberSocket(memberId),
    );

    // 중복 로그인 된 클라이언트가 있는 경우
    if (socketInfo) {
      const socketData = JSON.parse(socketInfo);

      // 클라이언트에게 중복 로그인 알림
      server.sockets
        .to(socketData.memberId)
        .emit(SOCKET_S_GLOBAL.S_DROP_PLAYER, 10000);

      this.messageHandler.publishHandler(
        `${NATS_EVENTS.DUPLICATE_LOGIN_USER}:${memberId}`,
        socketData.memberId,
      );

      // 서버에 저장된 소켓 정보 삭제
      await this.redisClient.del(RedisKey.getStrMemberSocket(memberId));
    }

    //사용자 닉네임 조회
    const member = await this.memberRepository.findOne({
      where: {
        memberId: memberId,
      },
    });

    // 클라이언트 데이터 설정
    client.data.memberId = memberId;
    client.data.sessionId = sessionId;
    client.data.jwtAccessToken = jwtAccessToken;
    client.data.nickname = member.nickname;
    client.data.clientId = member.memberCode;
    client.data.stateMessage = member.stateMessage;

    client.join(memberId);
    client.join(sessionId);

    await this.clientService.setSocket(member.memberCode, client);

    this.logger.debug(
      `Unification 서버에 연결되었어요 ✅: ${memberId} - sessionId : ${sessionId}`,
    );

    await this.redisClient.set(
      RedisKey.getStrMemberSocket(memberId),
      JSON.stringify(client.data),
    );

    //소켓 연결시 클라이언트에게 사용자 정보 전송
    client.emit(
      SOCKET_S_GLOBAL.S_PLAYER_CONNECTED,
      JSON.stringify(client.data),
    );
  }

  async handleDisconnect(client: CustomSocket) {
    const memberId = client.data.memberId;

    await this.checkLeaveRoom(client, memberId);
    await this.redisClient.del(RedisKey.getStrMemberSocket(memberId));

    // 중복 로그인 알림 구독 해제
    this.messageHandler.removeHandler(
      `${NATS_EVENTS.DUPLICATE_LOGIN_USER}:${memberId}`,
    );

    // 내 룸 구독 헤제
    this.messageHandler.removeHandler(memberId);
  }

  async handleRequestMessage(client: CustomSocket, payload: RequestPayload) {
    switch (payload.eventName) {
      case PLAYER_SOCKET_C_MESSAGE.C_ENTER:
        await this.joinRoom(client, payload.data as C_ENTER);
        break;
    }
  }

  async joinRoom(client: CustomSocket, packet: C_ENTER) {
    this.logger.debug('join room');
    console.log(packet);
    const authInfo =
      await this.tokenCheckService.getJwtAccessTokenAndSessionId(client);

    const jwtAccessToken = authInfo.jwtAccessToken;

    // 토큰을 검증하여 멤버 정보를 확인
    const memberInfo =
      await this.tokenCheckService.checkLoginToken(jwtAccessToken);

    const memberId = memberInfo.memberId;
    const redisRoomId = RedisKey.getStrRoomId(packet.roomId);

    console.log('########## 룸 입장 memberId : ', memberInfo.memberId);

    // 룸 존재 여부 확인
    console.log('################ redisRoomId : ', redisRoomId);
    const exRoom = await this.redisClient.hget(
      RedisKey.getStrRooms(),
      redisRoomId,
    );
    console.log('################ exRoom : ', exRoom);
    if (!exRoom) {
      return client.emit(
        SOCKET_S_GLOBAL.ERROR,
        SOCKET_SERVER_ERROR_CODE_GLOBAL.NOT_EXIST_ROOM,
      );
    }

    // 사용자키로 룸에 속해 있는지 조회
    const memberSetKey = RedisKey.getStrRoomPlayerList(redisRoomId);
    const members = await this.redisClient.smembers(memberSetKey);

    // 사용자가 현재 룸에 이미 입장 하고 있는 상태라면
    if (members && members.includes(memberId)) {
      return client.emit(
        SOCKET_S_GLOBAL.S_SYSTEM_MESSAGE,
        SOCKET_SERVER_ERROR_CODE_GLOBAL.ROOM_ALREADY_CONNECTED,
      );
    }

    // 사용자가 룸에 접속한 상태라면 기존 룸에서 퇴장 처리를 한다.
    this.logger.debug('기존 룸 접속 해제');
    await this.checkLeaveRoom(client, memberId);

    // 입장 처리
    client.data.roomId = redisRoomId;
    client.join(redisRoomId);

    // 룸에 사용자 정보 저장
    await this.redisClient.sadd(memberSetKey, memberId);

    // 사용자의 현재 룸 정보 업데이트
    await this.redisClient.set(
      RedisKey.getStrMemberCurrentRoom(memberId),
      redisRoomId,
    );

    await this.redisFunctionService.updateJson(
      RedisKey.getStrMemberSocket(memberId),
      'roomId',
      redisRoomId,
    );

    const response = new S_ENTER();
    response.result = 'success';
    const { eventName, ...packetData } = response;

    client.emit(eventName, packetData);

    await this.registerSubcribe(client.data.memberId, redisRoomId);
  }

  async registerSubcribe(memberId: string, redisRoomId: string) {
    // 현재 동기화 룸 구독 여부 체크
    {
      const isSubscribe = this.messageHandler.getSubscribe(
        `${NATS_EVENTS.SYNC_ROOM}:${redisRoomId}`,
      );

      if (!isSubscribe) {
        // 현재 룸을 구독한다.
        this.logger.debug('현재 동기화 룸 입장 구독 ✅ : ', redisRoomId);
        this.messageHandler.registerHandler(
          `${NATS_EVENTS.SYNC_ROOM}:${redisRoomId}`,
          async (message: string) => {
            this.subscribeService.roomSubscribePlayerCallbackmessage(message);
          },
        );
      }
    }
    {
      // 현재 채팅 룸 구독 여부 체크
      const isSubscribe = this.messageHandler.getSubscribe(
        `${NATS_EVENTS.CHAT_ROOM}:${redisRoomId}`,
      );

      if (!isSubscribe) {
        // 현재 룸을 구독한다.
        this.logger.debug('현재 채팅 룸 입장 구독 ✅ : ', redisRoomId);
        this.messageHandler.registerHandler(
          `${NATS_EVENTS.CHAT_ROOM}:${redisRoomId}`,
          async (message: string) => {
            this.subscribeService.roomSubscribeChatCallbackmessage(message);
          },
        );
      }
    }

    const roomType = await this.getRoomType(redisRoomId);

    if (roomType === RoomType.MyRoom) {
      // 현재 룸 동기화 구독 여부 체크
      const isSubscribe = this.messageHandler.getSubscribe(
        `${NATS_EVENTS.MY_ROOM}:${redisRoomId}`,
      );

      if (!isSubscribe) {
        // 현재 마이룸을 구독한다.
        this.logger.debug('마이룸 입장 구독 ✅ : ', redisRoomId);
        this.messageHandler.registerHandler(
          `${NATS_EVENTS.MY_ROOM}:${redisRoomId}`,
          async (message: string) => {
            this.subscribeService.roomSubscribeMyRoomCallbackmessage(message);
          },
        );
      }
    }

    // 룸 입장 이벤트 발생
    this.logger.debug('룸 입장 이벤트 발생 ✅ : ', redisRoomId);
    await this.messageHandler.publishHandler(
      `${NATS_EVENTS.JOIN_ROOM}`,
      JSON.stringify({
        memberId: memberId,
        roomId: redisRoomId,
      }),
    );
  }

  // 사용자 퇴장 처리
  async checkLeaveRoom(client: CustomSocket, memberId: string) {
    // 사용자의 현재 룸 조회
    const { memberKey, redisRoomId } =
      await this.socketService.getUserRoomId(memberId);
    console.log(
      '#################################  checkLeaveRoom redisRoomId : ',
      redisRoomId,
    );
    if (redisRoomId) {
      const roomIdArray = redisRoomId.split(':');
      const roomId = roomIdArray[1];

      console.log(
        '################################# checkLeaveRoom roomId : ',
        roomId,
      );
      if (roomId) {
        const playerIds = await this.redisClient.smembers(
          RedisKey.getStrRoomPlayerList(redisRoomId),
        );

        console.log(
          '################################# playerIds : ',
          playerIds,
        );

        // 룸에 사용자가 본인 1명 뿐이라면 룸 삭제
        if (playerIds && playerIds.length === 1) {
          await this.redisClient.del(redisRoomId);

          const roomData = JSON.parse(
            await this.redisClient.hget(RedisKey.getStrRooms(), redisRoomId),
          );

          console.log(
            '################################# roomData : ',
            roomData,
          );

          await this.redisClient.hdel(RedisKey.getStrRooms(), redisRoomId);

          if (roomData) {
            await this.redisClient.srem(
              RedisKey.getRoomsByType(roomData.type),
              redisRoomId,
            );
          }

          await this.messageHandler.publishHandler(
            NATS_EVENTS.DELETE_PLAYER_ROOM,
            redisRoomId,
          );
        }

        // 룸 사용자 리스트에서 사용자 정보 삭제
        await this.redisClient.srem(
          RedisKey.getStrRoomPlayerList(redisRoomId),
          client.data.memberId,
        );

        // 기존 룸에서 사용자 제거
        await this.redisClient.del(memberKey);

        client.leave(redisRoomId);

        // 룸 퇴장 이벤트 발생
        await this.messageHandler.publishHandler(
          `${NATS_EVENTS.LEAVE_ROOM}:${memberId}`,
          JSON.stringify({
            memberId: memberId,
            roomId: roomId,
          }),
        );

        // 게임 오브젝트 삭제
        await this.gameObjectService.removeGameObject(
          redisRoomId,
          client.data.clientId,
        );

        // 인터렉션 삭제
        await this.gameObjectService.removeGameObject(
          redisRoomId,
          client.data.clientId,
        );
      }
    }
  }

  async getRoomType(roomId: string): Promise<RoomType> {
    const myRoomInfos = await this.redisClient.smembers(
      RedisKey.getRoomsByType(RoomType.MyRoom),
    );

    if (myRoomInfos) {
      for (const myRoom of myRoomInfos) {
        if (myRoom === roomId) {
          return RoomType.MyRoom;
        }
      }
    }

    const officeInfos = await this.redisClient.smembers(
      RedisKey.getRoomsByType(RoomType.Office),
    );

    if (officeInfos) {
      for (const office of officeInfos) {
        if (office === roomId) {
          return RoomType.Office;
        }
      }
    }

    return null;
  }

  // 닉네임 변경 요청
  async nicknameChange(client: CustomSocket) {
    const nicknameFind = await this.memberRepository.findOne({
      where: {
        memberId: client.data.memberId,
      },
    });

    return await this.redisFunctionService.updateJson(
      RedisKey.getStrMemberSocket(client.data.memberId),
      'nickname',
      nicknameFind.nickname,
    );
  }

  // 접속 인원 알림
  async getCurrentUsers(data: any) {
    console.log(data);
    const serverType = process.env.SERVER_TYPE;
    const currentUsers = await this.redisClient.keys('socket:*');
    return await axios.post(process.env.DOORAY_WEBHOOK_URL, {
      botName: '아즈메타',
      botIconImage:
        'https://arzmeta.net/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Farz_logo_dark.f5efb990.png&w=1080&q=75',
      attachments: [
        {
          title: '접속 인원 알림',
          text: `현재 ${serverType} 아즈메타 접속자 수는 ${currentUsers.length} 명 입니다.`,
        },
      ],
    });
  }
}

import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { v4 as uuidv4 } from 'uuid';
import { Member } from '@libs/entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Redis } from 'ioredis';
import { Server } from 'socket.io';
import { Repository } from 'typeorm';
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
import { GameObjectService } from '../game/game-object.service';
import { ClientInfo, RequestPayload } from '../packets/packet-interface';
import { C_ENTER, S_ADD_CLIENT, S_ENTER, S_LEAVE } from '../packets/packet';
import { HubSocketService } from '../hub-socket/hub-socket.service';
import { SubscribeService } from '../nats/subscribe.service';
import { RoomType } from '../room/room-type';
import { ClientService } from '../services/client.service';
import { CustomSocket } from '../interfaces/custom-socket';
import { AuthService, CommonService } from '@libs/common';

@Injectable()
export class UnificationService {
  constructor(
    @InjectRedis() private readonly redisClient: Redis,
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
    private readonly gameObjectService: GameObjectService,
    private readonly redisFunctionService: RedisFunctionService,
    private readonly socketService: HubSocketService,
    private readonly subscribeService: SubscribeService,
    private readonly clientService: ClientService,
    private readonly authService: AuthService,
    private messageHandler: NatsMessageHandler,
  ) {}
  private readonly logger = new Logger(UnificationService.name);

  private server: Server;
  setServer(server: Server) {
    this.server = server;
  }

  //소켓 연결
  async handleConnection(server: Server, client: CustomSocket) {
    try {
      const memberInfo =
        await this.authService.checkAccessTokenForSocket(client);

      if (!memberInfo || !memberInfo.memberId) {
        client.emit(SOCKET_S_GLOBAL.S_DROP_PLAYER, 10002);
        client.disconnect();
        return;
      }

      const memberId = memberInfo.memberId;

      /**
       * 회원 아이디로 소켓 정보 조회
       * 회원 아이디로 저장 된 소켓 정보가 있다는 것은
       * 이미 해당 회원 아이디로 로그인 된 정보가 있다는 것
       * 중복으로 로그인을 시키면 안되기 때문에 기존 로그인은
       * Disconnect 시킨다.
       */
      //
      const socketInfo = await this.redisClient.get(
        RedisKey.getStrMemberSocket(memberId),
      );

      // 중복 로그인 된 클라이언트가 있는 경우
      if (socketInfo) {
        const socketData = JSON.parse(socketInfo);

        // 클라이언트에게 중복 로그인 알림과 disconnect
        this.logger.debug('중복 로그인 이벤트 발행: ', socketData.sessionId);
        this.messageHandler.publishHandler(
          `${NATS_EVENTS.DUPLICATE_LOGIN_USER}:${socketData.sessionId}`,
          socketData.sessionId,
        );

        // 서버에 저장된 소켓 정보 삭제
        await this.redisClient.del(RedisKey.getStrMemberSocket(memberId));
      }

      // 새로운 sessionId 발급
      const sessionId = uuidv4();

      // 클라이언트 데이터 설정
      client.data.memberId = memberId;
      client.data.nickname = memberInfo.nickname;
      client.data.clientId = memberInfo.memberCode;
      client.data.stateMessage = memberInfo.stateMessage;
      client.data.socketId = client.id;
      client.data.sessionId = sessionId;

      this.logger.debug('Client Data : ', client.data);

      client.join(memberId);
      client.join(sessionId);

      await this.clientService.setSocket(memberInfo.memberCode, client);

      this.logger.debug(
        `Unification 서버에 연결되었어요 ✅ memberId: ${memberId}`,
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
    } catch (error) {
      console.log('연결 처리 중 오류 발생:', error.toString());
      throw new Error('Unification Service Failure');
    }
  }

  async handleDisconnect(client: CustomSocket) {
    this.logger.debug('소켓 접속 해제 실행 ❌');
    const memberId = client.data.memberId;
    const sessionId = client.data.sessionId;

    await this.checkLeaveRoom(client, memberId);
    await this.allLeaveRoom(client);

    await this.redisClient.del(RedisKey.getStrMemberSocket(memberId));

    // 중복 로그인 알림 구독 해제
    this.messageHandler.removeHandler(
      `${NATS_EVENTS.DUPLICATE_LOGIN_USER}:${sessionId}`,
    );

    // 내 룸 구독 해제
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
    this.logger.debug('💚💚 Join Room 💚💚');
    console.log(packet);

    const memberId = client.data.memberId;
    const redisRoomId = RedisKey.getStrRoomId(packet.roomId);
    this.logger.debug('Join Room redisRoomId : ', redisRoomId);

    // 룸 존재 여부 확인
    const exRoom = await this.redisClient.hget(
      RedisKey.getStrRooms(),
      redisRoomId,
    );

    this.logger.debug('Join Room exRoom : ', exRoom);

    if (!exRoom) {
      return client.emit(
        SOCKET_S_GLOBAL.ERROR,
        SOCKET_SERVER_ERROR_CODE_GLOBAL.NOT_EXIST_ROOM,
      );
    }

    // 사용자키로 룸에 속해 있는지 조회
    const memberSetKey = RedisKey.getStrRoomPlayerList(redisRoomId);
    const members = await this.redisClient.smembers(memberSetKey);

    this.logger.debug('Join Room memberSetKey : ', memberSetKey);
    this.logger.debug('Join Room members : ', members);

    // 사용자가 현재 룸에 이미 입장 하고 있는 상태라면
    if (members && members.includes(memberId)) {
      return client.emit(
        SOCKET_S_GLOBAL.S_SYSTEM_MESSAGE,
        SOCKET_SERVER_ERROR_CODE_GLOBAL.ROOM_ALREADY_CONNECTED,
      );
    }

    // 사용자가 룸에 접속한 상태라면 기존 룸에서 퇴장 처리를 한다.
    this.logger.debug('기존 룸 접속 해제 시작');
    await this.checkLeaveRoom(client, memberId);
    this.logger.debug('기존 룸 접속 해제 완료');
    // 입장 처리
    client.data.roomId = redisRoomId;
    client.join(redisRoomId);
    this.logger.debug('Join Room 입장 완료');

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

    client.emit(eventName, JSON.stringify(packetData));

    await this.registerSubcribe(client.data.memberId, redisRoomId);

    const clientInfos: ClientInfo[] = [];
    clientInfos.push({
      clientId: client.data.clientId,
      nickname: client.data.nickname,
      stateMessage: client.data.stateMessage,
    });

    const broadcastPacket = new S_ADD_CLIENT();
    broadcastPacket.clientInfos = clientInfos;

    const broadcastData = {
      redisRoomId,
      packet: broadcastPacket,
    };

    console.log(
      '##################### NATS_EVENTS.SYNC_ROOM joinRoom: ',
      broadcastData,
    );
    console.log('##################### clientId : ', client.data.clientId);
    await this.messageHandler.publishHandler(
      `${NATS_EVENTS.SYNC_ROOM}:${redisRoomId}`,
      JSON.stringify(broadcastData),
    );
  }

  async registerSubcribe(memberId: string, redisRoomId: string) {
    // 현재 동기화 룸 구독 여부 체크
    {
      const isSubscribe = await this.messageHandler.getSubscribe(
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
      const isSubscribe = await this.messageHandler.getSubscribe(
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
      const isSubscribe = await this.messageHandler.getSubscribe(
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

    {
      // 현재 공용 룸 구독 여부 체크
      const isSubscribe = await this.messageHandler.getSubscribe(
        `${NATS_EVENTS.COMMON_ROOM}:${redisRoomId}`,
      );

      if (!isSubscribe) {
        // 현재 룸을 구독한다.
        this.logger.debug('현재 공용 룸 입장 구독 ✅ : ', redisRoomId);
        this.messageHandler.registerHandler(
          `${NATS_EVENTS.COMMON_ROOM}:${redisRoomId}`,
          async (message: string) => {
            this.subscribeService.roomSubscribeCommonCallbackmessage(message);
          },
        );
      }
    }

    // 룸 입장 이벤트 발생
    // this.logger.debug('룸 입장 이벤트 발생 ✅ : ', redisRoomId);
    // await this.messageHandler.publishHandler(
    //   `${NATS_EVENTS.JOIN_ROOM}`,
    //   JSON.stringify({
    //     memberId: memberId,
    //     roomId: redisRoomId,
    //   }),
    // );
  }

  async allLeaveRoom(client: CustomSocket) {
    const memberId = client.data.memberId;
    const roomsData = await this.redisClient.hgetall(RedisKey.getStrRooms());
    const roomKeys = Object.keys(roomsData);

    for (const r of roomKeys) {
      await this.redisClient.srem(RedisKey.getStrRoomPlayerList(r), memberId);
    }

    await this.redisClient.del(RedisKey.getStrMemberCurrentRoom(memberId));
  }

  // 사용자 퇴장 처리
  async checkLeaveRoom(client: CustomSocket, memberId: string) {
    // 사용자의 현재 룸 조회

    const memberKey = RedisKey.getStrMemberCurrentRoom(memberId);
    const redisRoomId = client.data.roomId;

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

        // 게임 오브젝트 삭제
        await this.gameObjectService.removeGameObject(
          redisRoomId,
          client.data.clientId,
        );

        // 인터렉션 삭제
        const interactionId = await this.gameObjectService.removeInteractions(
          redisRoomId,
          client.data.clientId,
        );

        const response = new S_LEAVE();
        response.clientId = client.data.clientId;
        response.objectId = client.data.objectId || null;
        response.interactionId = interactionId;

        const data = {
          redisRoomId,
          packet: response,
        };

        console.log(
          '##################### NATS_EVENTS.SYNC_ROOM checkLeaveRoom: ',
          data,
        );
        console.log('##################### clientId : ', client.data.clientId);
        // 룸 퇴장 이벤트 발생
        this.messageHandler.publishHandler(
          `${NATS_EVENTS.SYNC_ROOM}:${redisRoomId}`,
          JSON.stringify(data),
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

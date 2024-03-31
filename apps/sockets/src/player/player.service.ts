import { RedisFunctionService } from '@libs/redis';
import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Server, Socket } from 'socket.io';
import { TokenCheckService } from '../manager/auth/tocket-check.service';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { NatsMessageHandler } from '../nats/nats-message.handler';
import {
  CHATTING_SOCKET_S_MESSAGE,
  HUB_SOCKET_C_MESSAGE,
  NATS_EVENTS,
  PLAYER_SOCKET_C_MESSAGE,
  PLAYER_SOCKET_S_MESSAGE,
  RedisKey,
  SOCKET_S_GLOBAL,
  SOCKET_SERVER_ERROR_CODE_GLOBAL,
} from '@libs/constants';
import {
  C_BASE_INSTANTIATE_OBJECT,
  C_BASE_SET_ANIMATION,
  C_BASE_SET_ANIMATION_ONCE,
  C_BASE_SET_TRANSFORM,
  C_ENTER,
  C_INTERACTION_REMOVE_ITEM,
  C_INTERACTION_SET_ITEM,
  S_ENTER,
} from '../packets/packet';
import { GameObjectService } from './game/game-object.service';
import { RequestPayload } from '../packets/packet-interface';

@Injectable()
export class PlayerService {
  private readonly logger = new Logger(PlayerService.name);
  private hubSocketClient;
  private socketMap: Map<string, Socket> = new Map();
  private goReqMap: Map<string, string> = new Map();

  constructor(
    @InjectRedis() private readonly redisClient: Redis,
    @Inject(forwardRef(() => GameObjectService))
    private readonly gameObjectService: GameObjectService,
    private readonly tokenCheckService: TokenCheckService,
    private readonly messageHandler: NatsMessageHandler,
    private readonly redisFunctionService: RedisFunctionService,
  ) {}

  private server: Server;
  async setServer(server: Server) {
    this.server = server;
  }

  private gatewayId: string;
  async setGatewayId(gatewayId: string) {
    this.gatewayId = gatewayId;
  }

  async handleRequestMessage(client: Socket, payload: RequestPayload) {
    switch (payload.event) {
      case PLAYER_SOCKET_C_MESSAGE.C_ENTER:
        await this.joinRoom(client, payload.data as C_ENTER);
        break;
      case PLAYER_SOCKET_C_MESSAGE.C_GET_CLIENT:
        await this.getClient(client);
        break;
      case PLAYER_SOCKET_C_MESSAGE.C_BASE_INSTANTIATE_OBJECT:
        await this.baseInstantiateObject(
          client,
          payload.data as C_BASE_INSTANTIATE_OBJECT,
        );
        break;
      case PLAYER_SOCKET_C_MESSAGE.C_BASE_GET_OBJECT:
        await this.getObjects(client);
        break;
      case PLAYER_SOCKET_C_MESSAGE.C_BASE_SET_TRANSFORM:
        await this.baseSetTransform(
          client,
          payload.data as C_BASE_SET_TRANSFORM,
        );
        break;
      case PLAYER_SOCKET_C_MESSAGE.C_BASE_SET_ANIMATION:
        await this.baseSetAnimation(
          client,
          payload.data as C_BASE_SET_ANIMATION,
        );
        break;
      case PLAYER_SOCKET_C_MESSAGE.C_BASE_SET_ANIMATION_ONCE:
        await this.baseSetAnimationOnce(
          client,
          payload.data as C_BASE_SET_ANIMATION_ONCE,
        );
        break;
      case PLAYER_SOCKET_C_MESSAGE.C_INTERACTION_GET_ITEMS:
        await this.getInteraction(client);
        break;
      case PLAYER_SOCKET_C_MESSAGE.C_INTERACTION_SET_ITEM:
        await this.baseSetInteraction(
          client,
          payload.data as C_INTERACTION_SET_ITEM,
        );
        break;
      case PLAYER_SOCKET_C_MESSAGE.C_INTERACTION_REMOVE_ITEM:
        await this.baseRemoveInteraction(
          client,
          payload.data as C_INTERACTION_REMOVE_ITEM,
        );
        break;
      default:
        break;
    }
  }

  // async handleConnectionHub(gatewayId: string) {
  //   const hubUrl = `${process.env.HUB_URL}`;
  //   console.log(hubUrl);
  //   this.hubSocketClient = io(hubUrl, {
  //     query: {
  //       gatewayId,
  //     },
  //   });

  //   this.hubSocketClient.on('connect', () => {
  //     this.logger.debug('허브 소켓 서버에 연결됨');
  //     // 필요한 룸에 조인하거나, 메시지 교환을 위한 이벤트 리스너 등록
  //   });

  //   // HUB SOCKET의 게임오브젝트 목록 요청
  //   this.hubSocketClient.on(HUB_SOCKET_S_MESSAGE.S_GET_GAMEOBJECTS, (data) => {
  //     this.logger.debug('메인 소켓 서버로부터 메시지 수신:', data);
  //     // 여기서 데이터 처리 로직 구현
  //     this.getGameObjectsForHub(data);
  //   });

  //   // HUB SOCKET 에서 온 게임오브젝트 목록 응답
  //   this.hubSocketClient.on(
  //     HUB_SOCKET_S_MESSAGE.S_GAMEOBJECTS_RESULT,
  //     (data) => {
  //       const clientId = this.goReqMap.get(data.requestId);
  //       const socket = this.socketMap.get(clientId);
  //       if (socket) {
  //         socket.emit(
  //           PLAYER_SOCKET_S_MESSAGE.S_BASE_ADD_OBJECT,
  //           data.gameObjects,
  //         );
  //       }
  //     },
  //   );

  //   // HUB SOCKET의 인터랙션 목록 요청
  //   this.hubSocketClient.on(HUB_SOCKET_S_MESSAGE.S_GET_INTERACTIONS, (data) => {
  //     this.logger.debug('메인 소켓 서버로부터 메시지 수신:', data);
  //     // 여기서 데이터 처리 로직 구현
  //     this.getInteractionForHub(data);
  //   });

  //   // HUB SOCKET 에서 온 인터랙션 목록 응답
  //   this.hubSocketClient.on(
  //     HUB_SOCKET_S_MESSAGE.S_INTERACTIONS_RESULT,
  //     (data) => {
  //       const clientId = this.goReqMap.get(data.requestId);

  //       const socket = this.socketMap.get(clientId);

  //       if (socket) {
  //         socket.emit(
  //           PLAYER_SOCKET_S_MESSAGE.S_INTERACTION_GET_ITEMS,
  //           data.interactions,
  //         );
  //       }
  //     },
  //   );
  // }

  // 소켓 연결
  async handleConnection(server: Server, client: Socket) {
    const authInfo =
      await this.tokenCheckService.getJwtAccessTokenAndSessionId(client);

    const jwtAccessToken = authInfo.jwtAccessToken;
    const sessionId = authInfo.sessionId;

    const memberInfo =
      await this.tokenCheckService.checkLoginToken(jwtAccessToken);

    // 해당 멤버가 존재하지 않을 경우 연결 종료
    if (!memberInfo) {
      client.disconnect();
      return;
    }

    console.log(memberInfo);
    const memberId = memberInfo.memberId;

    client.join(memberId);
    client.join(sessionId);

    // 클라이언트 데이터 설정
    client.data.memberId = memberId;
    client.data.sessionId = sessionId;
    client.data.jwtAccessToken;
    client.data.clientId = memberInfo.memberCode;

    this.socketMap.set(memberInfo.memberCode, client);

    this.logger.debug(
      `동기화 서버에 연결되었어요 ✅ : ${memberId} - sessionId : ${sessionId}`,
    );
  }

  async handleDisconnect(client: Socket) {
    await this.checkLeaveRoom(client, client.data.clientId);
    this.logger.debug(
      `동기화 서버에 해제되었어요 ❌ : ${client.data.clientId} `,
    );
  }

  async joinRoom(client: Socket, packet: C_ENTER) {
    const authInfo =
      await this.tokenCheckService.getJwtAccessTokenAndSessionId(client);

    const jwtAccessToken = authInfo.jwtAccessToken;

    // 토큰을 검증하여 멤버 정보를 확인
    const memberInfo =
      await this.tokenCheckService.checkLoginToken(jwtAccessToken);

    const memberId = memberInfo.memberId;
    const clientId = memberInfo.memberCode;
    const redisRoomId = RedisKey.getStrRoomId(packet.roomId);

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
        CHATTING_SOCKET_S_MESSAGE.S_SYSTEM_MESSAGE,
        SOCKET_SERVER_ERROR_CODE_GLOBAL.ROOM_ALREADY_CONNECTED,
      );
    }

    // 사용자가 룸에 접속한 상태라면 기존 룸에서 퇴장 처리를 한다.
    await this.checkLeaveRoom(client, memberId);

    // 입장 처리
    client.data.redisRoomId = redisRoomId;
    client.join(redisRoomId);

    const response = new S_ENTER();
    response.result = 'success';
    client.emit(response.event, response.result);

    // 룸에 사용자 정보 저장
    await this.redisClient.sadd(memberSetKey, memberId);

    // 사용자의 현재 룸 정보 업데이트
    await this.redisClient.set(
      RedisKey.getStrMemberCurrentRoom(clientId),
      redisRoomId,
    );

    await this.redisFunctionService.updateJson(
      RedisKey.getStrMemberSocket(clientId),
      'roomId',
      redisRoomId,
    );

    // 현재 룸 구독 여부 체크
    const isSubscribe = this.messageHandler.getSubscribe(
      `${NATS_EVENTS.SYNC_ROOM}:${redisRoomId}`,
    );

    if (!isSubscribe) {
      // 현재 룸을 구독한다.
      this.logger.debug('현재 룸 입장 구독 ✅ : ', redisRoomId);
      this.messageHandler.registerHandler(
        `${NATS_EVENTS.SYNC_ROOM}:${redisRoomId}`,
        async (message: string) => {
          this.roomSubscribeCallbackmessage(message);
        },
      );
    }

    // 룸 입장 이벤트 발생
    this.logger.debug('동기화 서버 룸 입장 이벤트 발생 ✅ : ', redisRoomId);
    await this.messageHandler.publishHandler(
      `${NATS_EVENTS.JOIN_ROOM}`,
      JSON.stringify({
        memberId: client.data.memberId,
        roomId: packet.roomId,
      }),
    );
  }

  async roomSubscribeCallbackmessage(message) {
    this.logger.debug('룸 구독 콜백 ✅');
    const data = JSON.parse(message);

    switch (data.packet.event) {
      case PLAYER_SOCKET_C_MESSAGE.C_BASE_SET_TRANSFORM:
        await this.setTransform(data);
        break;
      case PLAYER_SOCKET_C_MESSAGE.C_BASE_SET_ANIMATION:
        await this.setAnimation(data);
        break;
      case PLAYER_SOCKET_C_MESSAGE.C_BASE_SET_ANIMATION_ONCE:
        await this.setAnimationOnce(data);
        break;
      // -- 브로드캐스팅을 위한 호출 --
      case PLAYER_SOCKET_S_MESSAGE.S_BASE_ADD_OBJECT:
        await this.instantiateObject(data);
        break;
      // -- 브로드캐스팅을 위한 호출 --
      case PLAYER_SOCKET_S_MESSAGE.S_INTERACTION_SET_ITEM_NOTICE:
        await this.setInteraction(data);
        break;
      case PLAYER_SOCKET_C_MESSAGE.C_INTERACTION_REMOVE_ITEM:
        await this.removeInteraction(data);
    }
  }

  async getClient(client: Socket) {
    // client의 룸 조회
    const clientId = client.data.clientId;
    const memberKey = RedisKey.getStrMemberCurrentRoom(clientId);
    const redisRoomId = await this.redisClient.get(memberKey);

    const playerIds = await this.redisClient.smembers(
      RedisKey.getStrRoomPlayerList(redisRoomId),
    );

    const clientInfos = [];

    for (const p of playerIds) {
      const socketInfo = JSON.parse(
        await this.redisClient.get(RedisKey.getStrMemberSocket(p)),
      );

      const client = {
        clientId: socketInfo.clientId,
        nickname: socketInfo.nickname,
        stateMessage: socketInfo.stateMessage,
      };

      clientInfos.push(client);
    }

    client.emit(
      PLAYER_SOCKET_S_MESSAGE.S_ADD_CLIENT,
      JSON.stringify(clientInfos),
    );
  }

  // 사용자 이동 동기화
  async baseSetTransform(client: Socket, packet: C_BASE_SET_TRANSFORM) {
    const redisRoomId = client.data.redisRoomId;

    this.logger.debug('사용자 이동 동기화 이벤트 발행 ✅ : ', redisRoomId);

    const data = {
      redisRoomId,
      packet,
    };

    this.messageHandler.publishHandler(
      `${NATS_EVENTS.SYNC_ROOM}:${redisRoomId}`,
      JSON.stringify(data),
    );
  }

  private async setTransform(data) {
    this.logger.debug('사용자 이동 동기화 실행 !! ✅', data);

    const redisRoomId = data.redisRoomId;
    const packet = data.packet as C_BASE_SET_TRANSFORM;

    const response = await this.gameObjectService.setTransform(
      redisRoomId,
      packet.objectId,
      packet.position,
      packet.rotation,
    );

    this.server.to(redisRoomId).emit(response.event, response.packetData);
  }

  // 사용자 애니메이션 동기화
  async baseSetAnimation(client: Socket, packet: C_BASE_SET_ANIMATION) {
    const redisRoomId = client.data.redisRoomId;

    const data = {
      redisRoomId,
      packet,
    };

    this.messageHandler.publishHandler(
      `${NATS_EVENTS.SYNC_ROOM}:${redisRoomId}`,
      JSON.stringify(data),
    );
  }

  private async setAnimation(data) {
    this.logger.debug('사용자 애니메이션 동기화 실행 !! ✅', data);

    const redisRoomId = data.redisRoomId;
    const packet = data.packet as C_BASE_SET_ANIMATION;

    const response = await this.gameObjectService.setAnimation(
      redisRoomId,
      packet.objectId,
      packet.animationId,
      packet.animation,
    );

    this.server.to(redisRoomId).emit(response.event, response.packetData);
  }

  async baseSetAnimationOnce(
    client: Socket,
    packet: C_BASE_SET_ANIMATION_ONCE,
  ) {
    const redisRoomId = client.data.redisRoomId;

    const data = {
      redisRoomId,
      packet,
    };

    this.messageHandler.publishHandler(
      `${NATS_EVENTS.SYNC_ROOM}:${redisRoomId}`,
      JSON.stringify(data),
    );
  }

  private async setAnimationOnce(data) {
    this.logger.debug('사용자 이모지 동기화 실행 !! ✅', data);

    const redisRoomId = data.redisRoomId;
    const packet = data.packet as C_BASE_SET_ANIMATION_ONCE;

    const response = await this.gameObjectService.setAnimationOnce(
      redisRoomId,
      packet.objectId,
      packet.animationId,
      packet.isLoop,
      packet.blend,
    );

    this.server.to(redisRoomId).emit(response.event, response.packetData);
  }

  async baseInstantiateObject(
    client: Socket,
    packet: C_BASE_INSTANTIATE_OBJECT,
  ) {
    const roomInfo = await this.getUserRoomId(client.data.memberId);
    const redisRoomId = roomInfo.redisRoomId;
    const clientId = client.data.clientId;

    const response = await this.gameObjectService.instantiateObject(
      redisRoomId,
      clientId,
      packet,
    );

    if (response.clientPacket) {
      client.emit(
        response.clientPacket.event,
        response.clientPacket.packetData,
      );
    }

    const data = {
      redisRoomId: roomInfo.redisRoomId,
      packet: response.broadcastPacket,
    };

    this.messageHandler.publishHandler(
      `${NATS_EVENTS.SYNC_ROOM}:${redisRoomId}`,
      JSON.stringify(data),
    );
  }

  async instantiateObject(data) {
    this.logger.debug('instantiateObject broadcast');

    const redisRoomId = data.redisRoomId;

    this.server.to(redisRoomId).emit(data.packet.event, data.packet.packetData);
  }

  async baseSetInteraction(client: Socket, packet: C_INTERACTION_SET_ITEM) {
    this.logger.debug('baseSetInteraction');

    const roomInfo = await this.getUserRoomId(client.data.memberId);
    const redisRoomId = roomInfo.redisRoomId;
    const clientId = client.data.clientId;

    const response = await this.gameObjectService.setInteraction(
      redisRoomId,
      clientId,
      packet.id,
      packet.state,
    );

    if (response.clientPacket) {
      client.emit(
        response.clientPacket.event,
        response.clientPacket.packetData,
      );
    }

    if (response.broadcastPacket) {
      const data = {
        redisRoomId: roomInfo.redisRoomId,
        packet: response.broadcastPacket,
      };

      this.messageHandler.publishHandler(
        `${NATS_EVENTS.SYNC_ROOM}:${redisRoomId}`,
        JSON.stringify(data),
      );
    }
  }

  private async setInteraction(data) {
    const redisRoomId = data.redisRoomId;

    this.server.to(redisRoomId).emit(data.packet.event, data.packet.packetData);
  }

  async baseRemoveInteraction(
    client: Socket,
    packet: C_INTERACTION_REMOVE_ITEM,
  ) {
    const roomInfo = await this.getUserRoomId(client.data.memberId);
    const redisRoomId = roomInfo.redisRoomId;
    const clientId = client.data.clientId;

    const response = await this.gameObjectService.removeInteraction(
      redisRoomId,
      clientId,
      packet.id,
    );

    if (response.clientPacket) {
      client.emit(
        response.clientPacket.event,
        response.clientPacket.packetData,
      );
    }

    if (response.broadcastPacket) {
      const data = {
        redisRoomId: roomInfo.redisRoomId,
        packet: response.broadcastPacket,
      };

      this.messageHandler.publishHandler(
        `${NATS_EVENTS.SYNC_ROOM}:${redisRoomId}`,
        JSON.stringify(data),
      );
    }
  }

  private async removeInteraction(data) {
    const redisRoomId = data.redisRoomId;

    this.server.to(redisRoomId).emit(data.packet.event, data.packet.packetData);
  }

  async getUserRoomId(clientId) {
    // 사용자의 현재 룸 조회
    const memberKey = RedisKey.getStrMemberCurrentRoom(clientId);
    const redisRoomId = await this.redisClient.get(memberKey);

    if (redisRoomId) {
      return { memberKey, redisRoomId };
    }

    return { memberKey, redisRoomId: null };
  }

  // 사용자 퇴장 처리
  async checkLeaveRoom(client: Socket, clientId: string) {
    // 사용자의 현재 룸 조회
    const { memberKey, redisRoomId } = await this.getUserRoomId(clientId);
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

        await this.redisFunctionService.updateJson(
          RedisKey.getStrMemberSocket(clientId),
          'roomId',
          '',
        );

        // 기존 룸에서 사용자 제거
        await this.redisClient.del(memberKey);

        client.leave(redisRoomId);

        // 룸 퇴장 이벤트 발생
        await this.messageHandler.publishHandler(
          `${NATS_EVENTS.LEAVE_ROOM}:${clientId}`,
          JSON.stringify({
            clientId: clientId,
            roomId: roomId,
          }),
        );

        // 게임 오브젝트 삭제
        await this.gameObjectService.removeGameObject(
          redisRoomId,
          client.data.clientId,
        );
      }
    }
  }

  async getObjects(client: Socket) {
    const roomInfo = await this.getUserRoomId(client.data.memberId);

    // 요청 아이디를 발급 하고 해당 요청을 보낸 사용자 아이디와 함께 저장
    const requestId = uuidv4();
    this.goReqMap.set(requestId, client.data.clientId);

    // 허브 소켓에 게임오브젝트 목록을 요청 보낸다.
    this.hubSocketClient.emit(HUB_SOCKET_C_MESSAGE.C_GET_GAMEOBJECTS, {
      requestId,
      roomId: roomInfo.redisRoomId,
    });
  }

  // 허브 소켓으로 요청 보내기
  async getGameObjectsForHub(data: any) {
    const requestId = data.requestId;
    const roomId = data.roomId;

    const gameObjects = await this.gameObjectService.getObjectsForHub(roomId);

    this.hubSocketClient.emit(HUB_SOCKET_C_MESSAGE.C_SEND_GAMEOBJECTS, {
      requestId,
      gatewayId: this.gatewayId,
      gameObjects,
    });
  }

  async getInteraction(client: Socket) {
    const roomInfo = await this.getUserRoomId(client.data.memberId);
    // 요청 아이디를 발급 하고 해당 요청을 보낸 사용자 아이디와 함께 저장
    const requestId = uuidv4();
    this.goReqMap.set(requestId, client.data.clientId);

    // 허브 소켓에 인터랙션 목록을 요청 보낸다.
    this.hubSocketClient.emit(HUB_SOCKET_C_MESSAGE.C_GET_INTERACTIONS, {
      requestId,
      roomId: roomInfo.redisRoomId,
    });
  }

  async getInteractionForHub(data: any) {
    const requestId = data.requestId;
    const roomId = data.roomId;

    const interactions =
      await this.gameObjectService.getInteractionForHub(roomId);

    this.hubSocketClient.emit(HUB_SOCKET_C_MESSAGE.C_SEND_INTERACTIONS, {
      requestId,
      gatewayId: this.gatewayId,
      interactions,
    });
  }

  async publishJoinRoom(roomId) {}
}

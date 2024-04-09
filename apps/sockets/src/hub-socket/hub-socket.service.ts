import {
  HUB_SOCKET_C_MESSAGE,
  HUB_SOCKET_S_MESSAGE,
  PLAYER_SOCKET_S_MESSAGE,
  RedisKey,
} from '@libs/constants';
import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { io } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import { GameObjectService } from '../game/game-object.service';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { CustomSocket } from '../interfaces/custom-socket';

@Injectable()
export class HubSocketService {
  constructor(
    @InjectRedis() private readonly redisClient: Redis,
    private readonly gameObjectService: GameObjectService,
  ) {}

  private readonly logger = new Logger(HubSocketService.name);
  private socketMap: Map<string, CustomSocket> = new Map();
  private goReqMap: Map<string, string> = new Map();

  private hubSocketClient;
  private gatewayId;

  async handleConnection(client: CustomSocket) {
    await this.socketMap.set(client.data.memberId, client);
  }

  async handleConnectionHub(gatewayId: string) {
    const hubUrl = `${process.env.HUB_URL}`;
    console.log('@@@@@@@@@@@@@ hubSocket connection : ', hubUrl);

    this.hubSocketClient = io(hubUrl, {
      query: {
        gatewayId,
      },
    });

    this.hubSocketClient.on('connect', () => {
      this.logger.debug('허브 소켓 서버에 연결됨');
      // 필요한 룸에 조인하거나, 메시지 교환을 위한 이벤트 리스너 등록
    });

    // HUB SOCKET의 게임오브젝트 목록 요청
    this.hubSocketClient.on(HUB_SOCKET_S_MESSAGE.S_GET_GAMEOBJECTS, (data) => {
      this.logger.debug('메인 소켓 서버로부터 메시지 수신:', data);
      // 여기서 데이터 처리 로직 구현
      this.getGameObjectsForHub(data);
    });

    // HUB SOCKET 에서 온 게임오브젝트 목록 응답
    this.hubSocketClient.on(
      HUB_SOCKET_S_MESSAGE.S_GAMEOBJECTS_RESULT,
      (data) => {
        this.logger.debug('메인 소켓 서버로부터 게임오브젝트 목록 응답:', data);
        const memberId = this.goReqMap.get(data.requestId);
        console.log(this.socketMap);
        const socket = this.socketMap.get(memberId);

        if (socket) {
          socket.emit(
            PLAYER_SOCKET_S_MESSAGE.S_BASE_ADD_OBJECT,
            JSON.stringify({
              gameObjects: data.gameObjects,
            }),
          );
        }
      },
    );

    // HUB SOCKET의 인터랙션 목록 요청
    this.hubSocketClient.on(HUB_SOCKET_S_MESSAGE.S_GET_INTERACTIONS, (data) => {
      this.logger.debug('메인 소켓 서버로부터 메시지 수신:', data);
      // 여기서 데이터 처리 로직 구현
      this.getInteractionForHub(data);
    });

    // HUB SOCKET 에서 온 인터랙션 목록 응답
    this.hubSocketClient.on(
      HUB_SOCKET_S_MESSAGE.S_INTERACTIONS_RESULT,
      (data) => {
        this.logger.debug(
          '메인 소켓 서버로부터 인터랙션 목록 응답 수신:',
          data,
        );
        const memberId = this.goReqMap.get(data.requestId);
        const socket = this.socketMap.get(memberId);

        if (socket) {
          const items = {
            items: data.interactions,
          };

          socket.emit(
            PLAYER_SOCKET_S_MESSAGE.S_INTERACTION_GET_ITEMS,
            JSON.stringify(items),
          );
        }
      },
    );
  }

  async getObjects(client: CustomSocket) {
    const roomId = client.data.roomId;

    // 요청 아이디를 발급 하고 해당 요청을 보낸 사용자 아이디와 함께 저장
    const requestId = uuidv4();
    this.goReqMap.set(requestId, client.data.memberId);

    // 허브 소켓에 게임오브젝트 목록을 요청 보낸다.
    this.hubSocketClient.emit(HUB_SOCKET_C_MESSAGE.C_GET_GAMEOBJECTS, {
      requestId,
      roomId,
    });
  }

  // 허브 소켓으로 응답 보내기
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

  async getInteraction(client: CustomSocket) {
    const roomInfo = await this.getUserRoomId(client.data.memberId);
    // 요청 아이디를 발급 하고 해당 요청을 보낸 사용자 아이디와 함께 저장
    const requestId = uuidv4();
    this.goReqMap.set(requestId, client.data.memberId);

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

  async getUserRoomId(memberId) {
    // 사용자의 현재 룸 조회
    this.logger.debug('사용자의 현재 룸 조회 : ', memberId);
    const memberKey = RedisKey.getStrMemberCurrentRoom(memberId);
    this.logger.debug('현재 룸 키 : ', memberKey);
    const redisRoomId = await this.redisClient.get(memberKey);
    this.logger.debug('현재 룸 아이디 : ', redisRoomId);
    if (redisRoomId) {
      return { memberKey, redisRoomId };
    }

    return { memberKey, redisRoomId: null };
  }
}

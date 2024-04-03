import { RedisFunctionService } from '@libs/redis';
import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { TokenCheckService } from '../unification/auth/tocket-check.service';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { NatsMessageHandler } from '../nats/nats-message.handler';
import {
  NATS_EVENTS,
  PLAYER_SOCKET_C_MESSAGE,
  PLAYER_SOCKET_S_MESSAGE,
  RedisKey,
} from '@libs/constants';
import {
  C_BASE_INSTANTIATE_OBJECT,
  C_BASE_REMOVE_OBJECT,
  C_BASE_SET_ANIMATION,
  C_BASE_SET_ANIMATION_ONCE,
  C_BASE_SET_TRANSFORM,
  C_INTERACTION_REMOVE_ITEM,
  C_INTERACTION_SET_ITEM,
  S_BASE_REMOVE_OBJECT,
} from '../packets/packet';
import { GameObjectService } from './game/game-object.service';
import { RequestPayload } from '../packets/packet-interface';
import { HubSocketService } from '../hub-socket/hub-socket.service';
import { CustomSocket } from '../interfaces/custom-socket';

@Injectable()
export class PlayerService {
  private readonly logger = new Logger(PlayerService.name);

  constructor(
    @InjectRedis() private readonly redisClient: Redis,
    @Inject(forwardRef(() => GameObjectService))
    private readonly gameObjectService: GameObjectService,
    private readonly socketService: HubSocketService,
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

  async handleRequestMessage(client: CustomSocket, payload: RequestPayload) {
    this.logger.debug('handleRequestMessage');
    console.log(payload);
    switch (payload.eventName) {
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
        await this.socketService.getObjects(client);
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
        await this.socketService.getInteraction(client);
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
      case PLAYER_SOCKET_C_MESSAGE.C_BASE_REMOVE_OBJECT:
        await this.baseRemoveGameObject(client);
        break;
      default:
        this.logger.debug('잘못된 요청 이벤트 입니다.');
        console.log(payload);
        break;
    }
  }

  async getClient(client: CustomSocket) {
    this.logger.debug('getClient');
    // client의 룸 조회
    const memberId = client.data.memberId;
    console.log('clientId: ', memberId);

    const memberKey = RedisKey.getStrMemberCurrentRoom(memberId);
    console.log('memberKey: ', memberKey);

    const redisRoomId = await this.redisClient.get(memberKey);
    console.log('redisRoomId: ', redisRoomId);

    const playerIds = await this.redisClient.smembers(
      RedisKey.getStrRoomPlayerList(redisRoomId),
    );
    console.log('playerIds: ', playerIds);
    const clientInfos = [];

    for (const p of playerIds) {
      const socketInfo = JSON.parse(
        await this.redisClient.get(RedisKey.getStrMemberSocket(p)),
      );
      console.log('socketInfo: ', socketInfo);

      const client = {
        clientId: socketInfo.clientId,
        nickname: socketInfo.nickname,
        stateMessage: socketInfo.stateMessage,
      };

      console.log('client: ', client);
      clientInfos.push(client);
    }

    client.emit(
      PLAYER_SOCKET_S_MESSAGE.S_ADD_CLIENT,
      JSON.stringify(clientInfos),
    );
  }

  // 사용자 이동 동기화
  async baseSetTransform(client: CustomSocket, packet: C_BASE_SET_TRANSFORM) {
    const redisRoomId = client.data.roomId;

    const response = new C_BASE_SET_TRANSFORM();
    response.objectId = packet.objectId;
    response.position = packet.position;
    response.rotation = packet.rotation;

    const data = {
      redisRoomId,
      packet: response,
    };

    this.logger.debug('사용자 이동 동기화 이벤트 발행 ✅ : ', data);

    this.messageHandler.publishHandler(
      `${NATS_EVENTS.SYNC_ROOM}:${redisRoomId}`,
      JSON.stringify(data),
    );
  }

  async setTransform(data) {
    this.logger.debug('사용자 이동 동기화 실행 !! ✅', data);

    const redisRoomId = data.redisRoomId;
    const packet = data.packet as C_BASE_SET_TRANSFORM;

    const response = await this.gameObjectService.setTransform(
      redisRoomId,
      packet.objectId,
      packet.position,
      packet.rotation,
    );

    console.log(response);

    this.server.to(redisRoomId).emit(response.eventName, response.packetData);
  }

  // 사용자 애니메이션 동기화
  async baseSetAnimation(client: CustomSocket, packet: C_BASE_SET_ANIMATION) {
    const redisRoomId = client.data.roomId;

    const response = new C_BASE_SET_ANIMATION();
    response.objectId = packet.objectId;
    response.animation = packet.animation;
    response.animationId = packet.animationId;

    const data = {
      redisRoomId,
      packet: response,
    };

    this.messageHandler.publishHandler(
      `${NATS_EVENTS.SYNC_ROOM}:${redisRoomId}`,
      JSON.stringify(data),
    );
  }

  async setAnimation(data) {
    this.logger.debug('사용자 애니메이션 동기화 실행 !! ✅', data);

    const redisRoomId = data.redisRoomId;
    const packet = data.packet as C_BASE_SET_ANIMATION;

    const response = await this.gameObjectService.setAnimation(
      redisRoomId,
      packet.objectId,
      packet.animationId,
      packet.animation,
    );

    this.server.to(redisRoomId).emit(response.eventName, response.packetData);
  }

  async baseSetAnimationOnce(
    client: CustomSocket,
    packet: C_BASE_SET_ANIMATION_ONCE,
  ) {
    const redisRoomId = client.data.roomId;

    const response = new C_BASE_SET_ANIMATION_ONCE();
    response.objectId = packet.objectId;
    response.animationId = packet.animationId;
    response.isLoop = packet.isLoop;
    response.blend = packet.blend;

    const data = {
      redisRoomId,
      packet: response,
    };

    this.messageHandler.publishHandler(
      `${NATS_EVENTS.SYNC_ROOM}:${redisRoomId}`,
      JSON.stringify(data),
    );
  }

  async setAnimationOnce(data) {
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

    this.server.to(redisRoomId).emit(response.eventName, response.packetData);
  }

  async baseInstantiateObject(
    client: CustomSocket,
    packet: C_BASE_INSTANTIATE_OBJECT,
  ) {
    const roomInfo = await this.socketService.getUserRoomId(
      client.data.memberId,
    );
    const redisRoomId = roomInfo.redisRoomId;
    const clientId = client.data.clientId;

    const response = await this.gameObjectService.instantiateObject(
      redisRoomId,
      clientId,
      packet,
    );

    if (response.clientPacket) {
      client.emit(
        response.clientPacket.eventName,
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

    this.server
      .to(redisRoomId)
      .emit(data.packet.eventName, data.packet.packetData);
  }

  async baseRemoveGameObject(client: CustomSocket) {
    // 사용자의 현재 룸 조회
    const memberId = client.data.memberId;
    const clientId = client.data.clientId;

    const { redisRoomId } = await this.socketService.getUserRoomId(memberId);

    const gameObjectIds = await this.gameObjectService.removeGameObject(
      redisRoomId,
      clientId,
    );

    const packet = new C_BASE_REMOVE_OBJECT();

    const data = {
      redisRoomId,
      packet,
      gameObjectIds,
    };

    this.messageHandler.publishHandler(
      `${NATS_EVENTS.SYNC_ROOM}:${redisRoomId}`,
      JSON.stringify(data),
    );
  }

  async removeGameObject(data) {
    console.log(data);
    const redisRoomId = data.redisRoomId;

    const packet = new S_BASE_REMOVE_OBJECT();
    packet.gameObjects = data.gameObjectIds;

    const { eventName, ...packetData } = packet;

    if (packetData.gameObjects.length <= 0) return;

    this.server.to(redisRoomId).emit(eventName, packetData);
  }

  async baseSetInteraction(
    client: CustomSocket,
    packet: C_INTERACTION_SET_ITEM,
  ) {
    this.logger.debug('baseSetInteraction');

    const roomInfo = await this.socketService.getUserRoomId(
      client.data.memberId,
    );
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
        response.clientPacket.eventName,
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

  async setInteraction(data) {
    const redisRoomId = data.redisRoomId;

    this.server
      .to(redisRoomId)
      .emit(data.packet.eventName, data.packet.packetData);
  }

  async baseRemoveInteraction(
    client: CustomSocket,
    packet: C_INTERACTION_REMOVE_ITEM,
  ) {
    const roomInfo = await this.socketService.getUserRoomId(
      client.data.memberId,
    );
    const redisRoomId = roomInfo.redisRoomId;
    const clientId = client.data.clientId;

    const response = await this.gameObjectService.removeInteraction(
      redisRoomId,
      clientId,
      packet.id,
    );

    if (response.clientPacket) {
      client.emit(
        response.clientPacket.eventName,
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

  async removeInteraction(data) {
    console.log(data);
    const redisRoomId = data.redisRoomId;

    this.server
      .to(redisRoomId)
      .emit(data.packet.eventName, data.packet.packetData);
  }

  async publishJoinRoom(roomId) {}
}

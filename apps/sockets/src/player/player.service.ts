import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { Server } from 'socket.io';
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
  C_BASE_SET_ANIMATION,
  C_BASE_SET_ANIMATION_ONCE,
  C_BASE_SET_TRANSFORM,
  C_INTERACTION_REMOVE_ITEM,
  C_INTERACTION_SET_ITEM,
  S_BASE_REMOVE_OBJECT,
  S_BASE_SET_ANIMATION,
  S_BASE_SET_TRANSFORM,
  S_LEAVE,
} from '../packets/packet';
import { GameObjectService } from '../game/game-object.service';
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
    private readonly messageHandler: NatsMessageHandler,
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
        this.logger.debug('잘못된 player 요청 이벤트 입니다.');
        console.log(payload);
        break;
    }
  }

  async getClient(client: CustomSocket) {
    // client의 룸 조회
    const memberId = client.data.memberId;

    const memberKey = RedisKey.getStrMemberCurrentRoom(memberId);

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
      JSON.stringify({ clientInfos }),
    );
  }

  // 사용자 이동 동기화
  async baseSetTransform(client: CustomSocket, packet: C_BASE_SET_TRANSFORM) {
    const redisRoomId = client.data.roomId;
    const socketId = client.data.socketId;

    const response = await this.gameObjectService.setTransform(
      redisRoomId,
      packet.objectId,
      packet.position,
      packet.rotation,
    );

    if (response) {
      const data = {
        redisRoomId,
        socketId,
        packet: response,
      };

      this.messageHandler.publishHandler(
        `${NATS_EVENTS.SYNC_ROOM}:${redisRoomId}`,
        JSON.stringify(data),
      );
    }
  }

  async setTransform(data) {
    const redisRoomId = data.redisRoomId;
    const socketId = data.socketId;

    const packet = data.packet as S_BASE_SET_TRANSFORM;

    const { eventName, ...packetData } = packet;

    this.server
      .to(redisRoomId)
      .except(socketId)
      .emit(eventName, JSON.stringify(packetData));
  }

  // 사용자 애니메이션 동기화
  async baseSetAnimation(client: CustomSocket, packet: C_BASE_SET_ANIMATION) {
    const redisRoomId = client.data.roomId;
    const socketId = client.data.socketId;

    const response = await this.gameObjectService.setAnimation(
      redisRoomId,
      packet.objectId,
      packet.animationId,
      packet.animation,
    );

    if (response) {
      const data = {
        redisRoomId,
        socketId,
        packet: response,
      };

      this.messageHandler.publishHandler(
        `${NATS_EVENTS.SYNC_ROOM}:${redisRoomId}`,
        JSON.stringify(data),
      );
    }
  }

  async setAnimation(data) {
    const redisRoomId = data.redisRoomId;
    const socketId = data.socketId;

    const { eventName, ...packetData } = data.packet;

    console.log('setAnimation: ', socketId);
    console.log('setAnimation: ', data.packet);

    this.server
      .to(redisRoomId)
      .except(socketId)
      .emit(eventName, JSON.stringify(packetData));
  }

  async baseSetAnimationOnce(
    client: CustomSocket,
    packet: C_BASE_SET_ANIMATION_ONCE,
  ) {
    const redisRoomId = client.data.roomId;
    const socketId = client.data.socketId;

    const response = await this.gameObjectService.setAnimationOnce(
      redisRoomId,
      packet.objectId,
      packet.animationId,
      packet.isLoop,
      packet.blend,
    );

    if (response) {
      const data = {
        redisRoomId,
        socketId,
        packet: response,
      };

      this.messageHandler.publishHandler(
        `${NATS_EVENTS.SYNC_ROOM}:${redisRoomId}`,
        JSON.stringify(data),
      );
    }
  }

  async setAnimationOnce(data) {
    const redisRoomId = data.redisRoomId;
    const socketId = data.socketId;

    const packet = data.packet as C_BASE_SET_ANIMATION_ONCE;

    const { eventName, ...packetData } = packet;

    this.server
      .to(redisRoomId)
      .except(socketId)
      .emit(eventName, JSON.stringify(packetData));
  }

  async baseInstantiateObject(
    client: CustomSocket,
    packet: C_BASE_INSTANTIATE_OBJECT,
  ) {
    const redisRoomId = client.data.roomId;
    const clientId = client.data.clientId;
    const socketId = client.data.socketId;

    const response = await this.gameObjectService.instantiateObject(
      redisRoomId,
      clientId,
      packet,
    );

    if (response) {
      if (response.clientPacket) {
        client.data.objectId = response.clientPacket.packetData.objectId;

        client.emit(
          response.clientPacket.eventName,
          JSON.stringify(response.clientPacket.packetData),
        );
      }

      const data = {
        redisRoomId,
        socketId,
        packet: response.broadcastPacket,
      };

      this.messageHandler.publishHandler(
        `${NATS_EVENTS.SYNC_ROOM}:${redisRoomId}`,
        JSON.stringify(data),
      );
    }
  }

  async instantiateObject(data) {
    const redisRoomId = data.redisRoomId;
    const socketId = data.socketId;

    this.server
      .to(redisRoomId)
      .except(socketId)
      .emit(data.packet.eventName, JSON.stringify(data.packet.packetData));
  }

  async baseRemoveGameObject(client: CustomSocket) {
    // 사용자의 현재 룸 조회
    const clientId = client.data.clientId;
    const redisRoomId = client.data.roomId;
    const socketId = client.data.socketId;

    const gameObjectIds = await this.gameObjectService.removeGameObject(
      redisRoomId,
      clientId,
    );

    const packet = new S_BASE_REMOVE_OBJECT();
    packet.gameObjects = gameObjectIds;

    const data = {
      redisRoomId,
      socketId,
      packet,
    };

    this.messageHandler.publishHandler(
      `${NATS_EVENTS.SYNC_ROOM}:${redisRoomId}`,
      JSON.stringify(data),
    );
  }

  async removeGameObject(data) {
    const redisRoomId = data.redisRoomId;
    const socketId = data.socketId;

    const packet = data.packet;

    const { eventName, ...packetData } = packet;

    if (packetData.gameObjects.length <= 0) return;

    this.server
      .to(redisRoomId)
      .except(socketId)
      .emit(eventName, JSON.stringify(packetData));
  }

  async baseSetInteraction(
    client: CustomSocket,
    packet: C_INTERACTION_SET_ITEM,
  ) {
    const redisRoomId = client.data.roomId;
    const clientId = client.data.clientId;
    const socketId = client.data.socketId;

    const response = await this.gameObjectService.setInteraction(
      redisRoomId,
      clientId,
      packet.id,
      packet.state,
    );

    if (response.clientPacket) {
      client.emit(
        response.clientPacket.eventName,
        JSON.stringify(response.clientPacket.packetData),
      );
    }

    if (response.broadcastPacket) {
      const data = {
        redisRoomId,
        socketId,
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
    const socketId = data.socketId;

    this.server
      .to(redisRoomId)
      .except(socketId)
      .emit(data.packet.eventName, JSON.stringify(data.packet.packetData));
  }

  async baseRemoveInteraction(
    client: CustomSocket,
    packet: C_INTERACTION_REMOVE_ITEM,
  ) {
    const redisRoomId = client.data.roomId;
    const clientId = client.data.clientId;
    const socketId = client.data.socketId;

    const response = await this.gameObjectService.removeInteraction(
      redisRoomId,
      clientId,
      packet.id,
    );

    if (response.clientPacket) {
      client.emit(
        response.clientPacket.eventName,
        JSON.stringify(response.clientPacket.packetData),
      );
    }

    if (response.broadcastPacket) {
      const data = {
        redisRoomId,
        socketId,
        packet: response.broadcastPacket,
      };

      this.messageHandler.publishHandler(
        `${NATS_EVENTS.SYNC_ROOM}:${redisRoomId}`,
        JSON.stringify(data),
      );
    }
  }

  async removeInteraction(data) {
    const redisRoomId = data.redisRoomId;
    const socketId = data.socketId;

    this.server
      .to(redisRoomId)
      .except(socketId)
      .emit(data.packet.eventName, JSON.stringify(data.packet.packetData));
  }

  async exitRoom(data) {
    const redisRoomId = data.redisRoomId;

    const packet = new S_LEAVE();
    packet.clientId = data.packet.clientId;
    packet.objectId = data.packet.objectId;
    packet.interactionId = data.packet.interactionId;

    const { eventName, ...packetData } = packet;

    this.server.to(redisRoomId).emit(eventName, JSON.stringify(packetData));
  }

  async addClient(data) {
    const redisRoomId = data.redisRoomId;
    const { eventName, ...packetData } = data.packet;
    this.server.to(redisRoomId).emit(eventName, JSON.stringify(packetData));
  }
}

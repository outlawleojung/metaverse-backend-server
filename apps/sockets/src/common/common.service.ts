import { Injectable, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';
import { ClientService } from '../services/client.service';
import { NatsMessageHandler } from '../nats/nats-message.handler';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Server } from 'socket.io';
import { CustomSocket } from '../interfaces/custom-socket';
import { PacketInfo, RequestPayload } from '../packets/packet-interface';
import {
  COMMON_SOCKET_C_MESSAGE,
  NATS_EVENTS,
  RedisKey,
  SOCKET_S_GLOBAL,
} from '@libs/constants';
import { RoomType } from '../room/room-type';
import {
  C_BASE_SET_OBJECT_DATA,
  S_BASE_SET_OBJECT_DATA,
  S_BASE_SET_OBJECT_DATA_NOTICE,
  S_MYROOM_GET_ROOMINFO,
} from '../packets/myroom-packet';
import { GameObjectService } from '../game/game-object.service';
import { HubSocketService } from '../hub-socket/hub-socket.service';

@Injectable()
export class CommonService {
  constructor(
    @InjectRedis() private readonly redisClient: Redis,
    private readonly clientService: ClientService,
    private readonly gameObjectService: GameObjectService,
    private readonly socketService: HubSocketService,
    private readonly messageHandler: NatsMessageHandler,
  ) {}

  private readonly logger = new Logger(CommonService.name);

  private server: Server;
  async setServer(server: Server) {
    this.server = server;
  }

  async handleRequestMessage(client: CustomSocket, payload: RequestPayload) {
    switch (payload.eventName) {
      case COMMON_SOCKET_C_MESSAGE.C_BASE_SET_OBJECT_DATA:
        await this.baseSetObjectData(
          client,
          payload.data as C_BASE_SET_OBJECT_DATA,
        );
        break;
      default:
        this.logger.debug('잘못된 패킷 입니다.');
        client.emit(SOCKET_S_GLOBAL.ERROR, '잘못된 패킷 입니다.');
        break;
    }
  }

  async baseSetObjectData(
    client: CustomSocket,
    payload: C_BASE_SET_OBJECT_DATA,
  ) {
    const roomId = client.data.roomId;
    const objectId = payload.objectId;
    const clientId = client.data.clientId;

    // 게임 오브젝트 데이터 존재 여부 확인
    const isExists = await this.gameObjectService.getExistsGameObject(
      roomId,
      objectId,
    );

    const packet = new S_BASE_SET_OBJECT_DATA();

    if (!isExists) {
      packet.success = false;
      const { eventName, ...packetData } = packet;

      return client.emit(eventName, packetData);
    } else {
      {
        packet.success = true;
        const { eventName, ...packetData } = packet;

        client.emit(eventName, packetData);
      }
      {
        const packet = new S_BASE_SET_OBJECT_DATA_NOTICE();
        packet.objectId = objectId;
        packet.objectData = payload.objectData;

        const data = {
          redisRoomId: roomId,
          packet,
        };

        this.messageHandler.publishHandler(
          `${NATS_EVENTS.COMMON_ROOM}:${roomId}`,
          JSON.stringify(data),
        );
      }

      const isMyRoom = await this.isMyRoom(roomId);

      console.log(
        `roomId: ${roomId}, objectId: ${objectId}, isMyRoom: ${isMyRoom}`,
      );
      if (isMyRoom) {
        const roomData = JSON.parse(
          await this.redisClient.hget(RedisKey.getStrRooms(), roomId),
        );

        console.log(roomData);
        if (roomData.ownerId === clientId) {
          console.log('마이룸의 주인이 요청한 변경');

          const roomData = JSON.parse(
            await this.redisClient.hget(RedisKey.getStrRooms(), roomId),
          );

          const updateObjectData = JSON.parse(payload.objectData);
          roomData.ownerAvatarInfo = updateObjectData;

          await this.redisClient.hset(
            RedisKey.getStrRooms(),
            roomId,
            JSON.stringify(roomData),
          );

          const packet = new S_MYROOM_GET_ROOMINFO();
          packet.ownerId = roomData.ownerId;
          packet.ownerNickname = roomData.ownerNickname;
          packet.isShutdown = roomData.isShutdown;
          packet.ownerAvatarInfo = roomData.ownerAvatarInfo;

          const data = {
            redisRoomId: roomId,
            packet,
          };

          this.messageHandler.publishHandler(
            `${NATS_EVENTS.COMMON_ROOM}:${roomId}`,
            JSON.stringify(data),
          );
        }
      }
    }
  }

  async broadcastSetObjectData(data) {
    const redisRoomId = data.redisRoomId;
    const { eventName, ...packetData } = data.packet;

    this.server.to(redisRoomId).emit(eventName, packetData);
  }

  async broadcastMyRoomGetRoomInfo(data) {
    const redisRoomId = data.redisRoomId;
    const { eventName, ...packetData } = data.packet;

    this.server.to(redisRoomId).emit(eventName, packetData);
  }

  async isMyRoom(roomId: string): Promise<boolean> {
    const myRoomInfos = await this.redisClient.smembers(
      RedisKey.getRoomsByType(RoomType.MyRoom),
    );

    console.log(myRoomInfos);

    for (const myRoom of myRoomInfos) {
      if (myRoom === roomId) {
        return true;
      }
    }

    return false;
  }
}

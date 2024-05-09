import { Injectable, Logger } from '@nestjs/common';
import { Server } from 'socket.io';
import { CustomSocket } from '../interfaces/custom-socket';
import { RequestPayload } from '../packets/packet-interface';
import {
  MATCHING_SOCKET_C_MESSAGE,
  RedisKey,
  SOCKET_S_GLOBAL,
} from '@libs/constants';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { S_MATCHING_HOST } from '../packets/matching-packet';
import { GameData } from '../game/game-data';

@Injectable()
export class MatchingService {
  constructor(@InjectRedis() private readonly redisClient: Redis) {}

  private readonly logger = new Logger(MatchingService.name);

  private gameDatas: Map<string, GameData> = new Map();

  private server: Server;
  async setServer(server: Server) {
    this.server = server;
  }

  async handleRequestMessage(client: CustomSocket, payload: RequestPayload) {
    switch (payload.eventName) {
      case MATCHING_SOCKET_C_MESSAGE.C_MATCHING_GET_HOST:
        await this.getHost(client);
        break;
      case MATCHING_SOCKET_C_MESSAGE.C_MATCHING_START:
        await this.getHost(client);
        break;

      default:
        this.logger.debug('잘못된 패킷 입니다.');
        client.emit(SOCKET_S_GLOBAL.ERROR, '잘못된 패킷 입니다.');
        break;
    }
  }

  async getHost(client: CustomSocket) {
    const roomId = client.data.roomId;
    const roomDataString = await this.redisClient.hget(
      RedisKey.getStrRooms(),
      roomId,
    );

    const roomData = JSON.parse(roomDataString);

    const packet = new S_MATCHING_HOST();
    packet.clientId = roomData.ownerId;

    const { eventName, ...packetData } = packet;

    client.emit(eventName, packetData);
  }

  async matchingStart() {}
}

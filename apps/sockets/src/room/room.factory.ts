import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { GameRoom } from '../rooms/game-room';
import { MyRoom } from '../rooms/my-room';
import { IRoom } from './room';
import { RoomType } from './room-type';
import { RoomService } from './room.service';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { RedisKey } from '@libs/constants';
import { OfficeRoom } from '../rooms/office-room';

@Injectable()
export class RoomFactory {
  constructor(
    @Inject(forwardRef(() => RoomService))
    private roomService: RoomService,
    @InjectRedis() private readonly redisClient: Redis,
  ) {}

  async createRoom(
    type: RoomType,
    sceneName: string,
    roomId: string,
    ownerId: string = null,
    roomCode: string = null,
    roomName: string = null,
  ): Promise<IRoom> {
    switch (type) {
      case RoomType.Game:
        return new GameRoom({ roomId, roomName, ownerId, sceneName });
      case RoomType.MyRoom:
        // 중복 검증
        const exMyRoom = await this.redisClient.get(
          RedisKey.getStrMyRoom(ownerId),
        );
        if (exMyRoom) {
          return JSON.parse(exMyRoom) as MyRoom;
        }
        return new MyRoom({ roomId, sceneName, ownerId });
      case RoomType.Office:
        return new OfficeRoom({
          roomId,
          sceneName,
          ownerId,
          roomCode,
        });
      default:
        throw new Error('Invalid room type');
    }
  }
}

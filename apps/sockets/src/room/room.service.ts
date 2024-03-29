import { GetRoomRequestDto } from './dto/get-room-request.dto';
import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { IRoom, IRoomWithCode, IRoomWithOwner, IRoomWithPlaying } from './room';
import { RoomFactory } from './room.factory';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { RoomType } from './room-type';
import { RedisKey } from '@libs/constants';
import { RedisLockService } from '../services/redis-lock.service';
import { MyRoom } from './rooms/my-room';
import { CreateRoomRequestDto } from './dto/create-room-request.dto';

@Injectable()
export class RoomService {
  private logger = new Logger(RoomService.name);

  constructor(
    @InjectRedis() private readonly redisClient: Redis,
    @Inject(forwardRef(() => RoomFactory))
    private readonly roomFactory: RoomFactory,
    private readonly lockService: RedisLockService,
  ) {}

  async getRoom(roomId: string): Promise<IRoom> {
    const roomKey = RedisKey.getStrRooms();

    const roomData = await this.redisClient.hget(roomKey, roomId);

    if (roomData) {
      const room = JSON.parse(roomData) as IRoom;

      return await this.convertRoomTypeForRoom(room);
    } else {
      return null;
    }
  }

  async convertRoomTypeForRoom(room: IRoom): Promise<IRoom> {
    const type = room.type;

    switch (type) {
      case RoomType.Arz:
      case RoomType.Game:
      case RoomType.Festival:
      case RoomType.Conference:
      case RoomType.Vote:
      case RoomType.Store:
      case RoomType.Office:
      case RoomType.Busan:
        return null;
      case RoomType.MyRoom:
        return room as MyRoom;
      default:
        return null;
    }
  }

  async getRooms(
    req: GetRoomRequestDto,
  ): Promise<IRoom | IRoom[] | undefined | null> {
    const redisRooms = await this.redisClient.hgetall(RedisKey.getStrRooms());

    if (!req.roomId && !req.ownerId && !req.roomType) {
      return Object.values(redisRooms).map((data) => JSON.parse(data));
    }

    if (req.roomId && !req.ownerId && !req.roomType) {
      const room = await this.redisClient.hget(
        RedisKey.getStrRooms(),
        req.roomId,
      );

      return JSON.parse(room);
    }

    const type = req.roomType;

    const redisTypeRooms = await this.redisClient.smembers(
      RedisKey.getRoomsByType(type),
    );
    const _rooms: IRoom[] = [];

    switch (type) {
      case RoomType.Arz:
      case RoomType.Game:
      case RoomType.Festival:
      case RoomType.Conference:
      case RoomType.Vote:
      case RoomType.Store:
      case RoomType.Office:
      case RoomType.Busan:
        for (const room of redisTypeRooms) {
          const r = JSON.parse(room) as IRoom;
          _rooms.push(r);
        }
        break;
      case RoomType.MyRoom:
        if (req.ownerId) {
          for (const [_, roomData] of Object.entries(redisRooms)) {
            const r = JSON.parse(roomData) as IRoomWithOwner;
            if (r.ownerId === req.ownerId) {
              _rooms.push(r);
            }
          }
        }
        break;
      case RoomType.Meeting:
      case RoomType.Lecture:
      case RoomType.Consulting:
        if (req.roomCode) {
          for (const [_, roomData] of Object.entries(redisRooms)) {
            const r = JSON.parse(roomData) as IRoomWithCode;
            if (r.roomCode === req.roomCode) {
              _rooms.push(r);
            }
          }
        }
        break;
      case RoomType.JumpingMatching:
      case RoomType.OXQuiz:
        if (req.roomCode) {
          for (const [_, roomData] of Object.entries(redisRooms)) {
            const r = JSON.parse(roomData) as IRoomWithPlaying;
            if (r.roomCode === req.roomCode && r.isPlaying) {
              _rooms.push(r);
            }
          }
        } else {
          for (const [_, roomData] of Object.entries(redisRooms)) {
            const r = JSON.parse(roomData) as IRoomWithPlaying;
            if (!r.isPlaying) {
              _rooms.push(r);
            }
          }
        }
        break;
      default:
        throw new Error('Invalid RoomType value');
    }

    return _rooms;
  }

  async createRoom(req: CreateRoomRequestDto) {
    const roomId = await this.generateRoomId();

    const redisRoomId = RedisKey.getStrRoomId(roomId);
    this.logger.debug('create Room : ', JSON.stringify({ req }));

    const room = await this.roomFactory.createRoom(
      req.roomType,
      req.sceneName,
      redisRoomId,
      req.ownerId,
    );

    this.logger.debug('create Room : ', JSON.stringify({ room }));

    // 레디스에 룸아이디를 키로 저장 'rooms:{roomId}:roomData'
    await this.redisClient.hset(
      RedisKey.getStrRooms(),
      room.roomId,
      JSON.stringify(room),
    );

    // 레디스에 type을 키로 룸 아이디를 리스트로 저장 'roomType:${type}:[roomId]'
    await this.redisClient.sadd(
      RedisKey.getRoomsByType(room.type),
      room.roomId,
    );

    return {
      type: room.type,
      roomId: roomId,
      sceneName: room.sceneName,
      ownerId: req.ownerId,
    };
  }

  async removeRoom(roomId: string): Promise<void> {
    // 레디스에서 삭제
    await this.redisClient.hdel(
      RedisKey.getStrRooms(),
      RedisKey.getStrRoomId(roomId),
    );
  }

  private async generateRoomId(): Promise<string> {
    const lockKey = RedisKey.getStrRedisLockKey('roomId');
    if (await this.lockService.tryLock(lockKey, 30000)) {
      try {
        const roomId = (
          await this.redisClient.incr(RedisKey.getStrRoomIdCounter())
        ).toString();
        this.logger.debug(`Room Id 생성 ✅ ${roomId} `);
        return roomId;
      } catch (err) {
        this.logger.error(`룸 아이디 생성 오류 발생 ❌`, err);
        throw new ForbiddenException('룸 아이디 생성 오류 발생 ❌');
      } finally {
        await this.lockService.releaseLock(lockKey);
      }
    }
  }
}

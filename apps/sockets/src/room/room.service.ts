import { GetRoomRequestDto } from './dto/get-room-request.dto';
import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { IRoom } from './room';
import { RoomFactory } from './room.factory';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { RoomType } from './room-type';
import { RedisKey } from '@libs/constants';
import { RedisLockService } from '../services/redis-lock.service';
import { MyRoom } from '../rooms/my-room';
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

  indexRoom(room: IRoom) {
    switch (room.type) {
      case RoomType.MyRoom:
        const myRoom = room as MyRoom;
        this.redisClient.set(
          RedisKey.getStrMyRoom(myRoom.ownerId),
          JSON.stringify(myRoom),
        );
        break;

      case RoomType.Arz:
        break;

      case RoomType.Game:
        break;

      case RoomType.Festival:
        break;

      case RoomType.Conference:
        break;

      case RoomType.Vote:
        break;

      case RoomType.Store:
        break;

      case RoomType.Office:
        break;

      case RoomType.Busan:
        break;

      case RoomType.Hospital:
        break;

      default:
        break;
    }
  }

  async getRooms(
    req: GetRoomRequestDto,
  ): Promise<IRoom | IRoom[] | undefined | null> {
    const redisRooms = await this.redisClient.hgetall(RedisKey.getStrRooms());
    if (!req.roomId && !req.ownerId && !req.roomType) {
      return Object.values(redisRooms).map((data) => JSON.parse(data));
    }

    const type = req.roomType;

    switch (type) {
      case RoomType.Arz:
        break;

      case RoomType.Game:
        break;

      case RoomType.Festival:
        break;

      case RoomType.Conference:
        break;

      case RoomType.Vote:
        break;

      case RoomType.Store:
        break;

      case RoomType.Office:
        break;

      case RoomType.Busan:
        break;

      case RoomType.MyRoom:
        if (req.ownerId) {
        }
      default:
        break;
    }
  }

  async createRoom(req: CreateRoomRequestDto): Promise<IRoom> {
    const roomId = await this.generateRoomId();

    this.logger.debug('create Room : ', JSON.stringify({ req }));

    const room = await this.roomFactory.createRoom(
      req.roomType,
      req.sceneName,
      roomId,
      req.ownerId,
    );

    this.logger.debug('create Room : ', JSON.stringify({ room }));

    // 레디스에 저장
    await this.redisClient.hset(
      RedisKey.getStrRooms(),
      room.roomId,
      JSON.stringify(room),
    );

    return room;
  }

  async removeRoom(roomId: string): Promise<void> {
    // 레디스에서 삭제
    await this.redisClient.hdel(RedisKey.getStrRooms(), roomId);
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

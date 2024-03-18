// redis-lock.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

@Injectable()
export class RedisLockService {
  private readonly logger = new Logger(RedisLockService.name);
  constructor(@InjectRedis() private readonly redisClient: Redis) {}

  async tryLock(lockKey: string, ttl: number): Promise<boolean> {
    const result = await this.redisClient.set(
      lockKey,
      'locked',
      'PX',
      ttl,
      'NX',
    );
    const lockAcquired = result === 'OK';

    lockAcquired
      ? this.logger.debug(`${lockKey} : Redis Lock 획득 성공 ✅`)
      : this.logger.debug(`${lockKey} : Redis Lock 획득 실패 ❌`);
    return lockAcquired;
  }

  async releaseLock(lockKey: string): Promise<void> {
    this.logger.debug(`${lockKey} : Redis Lock 해제 성공 ✅`);
    await this.redisClient.del(lockKey);
  }
}

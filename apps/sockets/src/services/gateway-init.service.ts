import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RedisLockService } from './redis-lock.service';
import { RedisKey } from '@libs/constants';

@Injectable()
export class GatewayInitiService {
  constructor(
    @InjectRedis() private readonly redisClient: Redis,
    private readonly lockService: RedisLockService,
  ) {}

  public async initializeGateway(
    gateway: string,
    logger: Logger,
  ): Promise<boolean> {
    const lockKey = RedisKey.getStrRedisLockKey(gateway);

    // Lock 획득 시도
    if (await this.lockService.tryLock(lockKey, 30000)) {
      try {
        // Lock을 획득한 후에 초기화 상태를 다시 확인
        const isInitialized = await this.redisClient.get(
          `gateway:${process.env.INSTANCE_NAME}:${gateway}:initialized`,
        );

        if (!isInitialized) {
          // Gateway 초기화가 완료되었음을 Redis에 저장
          await this.redisClient.set(
            `gateway:${process.env.INSTANCE_NAME}:${gateway}:initialized`,
            'true',
            'EX',
            30,
          );
          logger.debug(`${gateway} 초기화 완료 상태 Redis에 저장됨 ✅`);
          return false; // 초기화가 필요했음
        } else {
          logger.debug(`${gateway} 이미 초기화 되었음 ❌`);
          return true; // 이미 초기화되었음
        }
      } catch (err) {
        logger.error(`${gateway} 초기화 중 오류 발생 ❌`, err);
        return false;
      } finally {
        await this.lockService.releaseLock(lockKey);
      }
    }

    return true;
  }
}

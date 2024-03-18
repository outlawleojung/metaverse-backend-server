import { Injectable } from '@nestjs/common';
import {
  RedisModuleOptions,
  RedisOptionsFactory,
} from '@liaoliaots/nestjs-redis';
import * as dotenv from 'dotenv';
dotenv.config();
@Injectable()
export class RedisConfigService implements RedisOptionsFactory {
  createRedisOptions(): RedisModuleOptions {
    return {
      readyLog: true,
      config: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD,
        retryStrategy(times: number): number {
          // 재연결 시도 간의 지연 시간을 밀리초 단위로 반환합니다.
          // 여기서는 재시도 횟수에 따라 다른 지연 시간을 설정할 수 있습니다.
          return Math.min(times * 50, 1000); // 예: 최대 2초까지 지연
        },
      },
    };
  }
}

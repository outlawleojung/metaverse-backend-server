import { Module } from '@nestjs/common';
import { ScreenBannerService } from './screen-banner.service';
import { RedisFunctionService } from '@libs/redis';
import { TokenCheckService } from '../manager/auth/tocket-check.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  BannerInfo,
  BannerReservation,
  Member,
  ScreenInfo,
  ScreenReservation,
  SessionInfo,
} from '@libs/entity';
import { DataSource } from 'typeorm';
import { NatsService } from '../nats/nats.service';
import { GatewayInitiService } from '../services/gateway-init.service';
import { RedisLockService } from '../services/redis-lock.service';
import { NatsMessageHandler } from '../nats/nats-message.handler';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Member,
      DataSource,
      SessionInfo,
      ScreenInfo,
      BannerInfo,
      ScreenReservation,
      BannerReservation,
    ]),
  ],
  providers: [
    ScreenBannerService,
    TokenCheckService,
    RedisFunctionService,
    NatsService,
    GatewayInitiService,
    RedisLockService,
    NatsMessageHandler,
  ],
  exports: [ScreenBannerService],
})
export class ScreenBannerModule {}

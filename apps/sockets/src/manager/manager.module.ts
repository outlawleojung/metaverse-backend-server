import { EntityModule, Member, SessionInfo } from '@libs/entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from '../app.module';
import { TokenCheckService } from './auth/tocket-check.service';
import { ManagerGateway } from './manager.gateway';
import { ManagerService } from './manager.service';
import { RedisFunctionService } from '@libs/redis';
import { GatewayInitiService } from '../services/gateway-init.service';
import { RedisLockService } from '../services/redis-lock.service';
import { NatsService } from '../nats/nats.service';
import { NatsMessageHandler } from '../nats/nats-message.handler';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MorganInterceptor, MorganModule } from 'nest-morgan';

@Module({
  imports: [
    TypeOrmModule.forFeature([Member, SessionInfo]),
    AppModule,
    EntityModule,
    MorganModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: MorganInterceptor('combined'),
    },
    ManagerGateway,
    ManagerService,
    TokenCheckService,
    RedisFunctionService,
    TokenCheckService,
    GatewayInitiService,
    RedisLockService,
    NatsService,
    NatsMessageHandler,
  ],
  exports: [ManagerGateway, ManagerService],
})
export class ManagerModule {}

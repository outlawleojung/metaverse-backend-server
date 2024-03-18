import { Module } from '@nestjs/common';
import { PlayerService } from './player.service';
import { PlayerGateway } from './player.gateway';
import { GatewayInitiService } from '../services/gateway-init.service';
import { RedisLockService } from '../services/redis-lock.service';
import { TokenCheckService } from '../manager/auth/tocket-check.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member, SessionInfo } from '@libs/entity';
import { NatsService } from '../nats/nats.service';
import { NatsMessageHandler } from '../nats/nats-message.handler';
import { RootServerService } from '../services/root-server.service';
import { ManagerGateway } from '../manager/manager.gateway';
import { RedisFunctionService } from '@libs/redis';
import { ManagerService } from '../manager/manager.service';

@Module({
  imports: [TypeOrmModule.forFeature([Member, SessionInfo])],
  providers: [
    PlayerGateway,
    PlayerService,
    GatewayInitiService,
    RedisLockService,
    TokenCheckService,
    NatsService,
    NatsMessageHandler,
    RootServerService,
    RedisFunctionService,
    ManagerGateway,
    ManagerService,
  ],
})
export class PlayerModule {}

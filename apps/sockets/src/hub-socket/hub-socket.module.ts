import { Module } from '@nestjs/common';
import { HubSocketService } from './hub-socket.service';
import { GameObjectService } from '../player/game/game-object.service';
import { RedisLockService } from '../services/redis-lock.service';
import { NatsMessageHandler } from '../nats/nats-message.handler';
import { NatsService } from '../nats/nats.service';
import { TokenCheckService } from '../unification/auth/tocket-check.service';
import { RedisFunctionService } from '@libs/redis';
import { GatewayInitiService } from '../services/gateway-init.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member, MemberOfficeVisitLog, SessionInfo } from '@libs/entity';
import { ClientService } from '../services/client.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Member, SessionInfo, MemberOfficeVisitLog]),
  ],
  providers: [
    HubSocketService,
    GameObjectService,
    RedisLockService,
    NatsMessageHandler,
    NatsService,
    TokenCheckService,
    RedisFunctionService,
    GatewayInitiService,
    ClientService,
  ],
  exports: [
    HubSocketService,
    GameObjectService,
    NatsMessageHandler,
    RedisLockService,
    NatsService,
    TokenCheckService,
    RedisFunctionService,
    GatewayInitiService,
    ClientService,
  ],
})
export class HubSocketModule {}

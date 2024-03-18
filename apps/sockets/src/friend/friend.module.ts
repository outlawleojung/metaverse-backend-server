import { Module } from '@nestjs/common';
import { FriendService } from './friend.service';
import { FriendGateway } from './friend.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '@libs/common';
import { Member, MemberFriend, SessionInfo } from '@libs/entity';
import { DataSource } from 'typeorm';
import { TokenCheckService } from '../manager/auth/tocket-check.service';
import { RedisFunctionService } from '@libs/redis';
import { GatewayInitiService } from '../services/gateway-init.service';
import { RedisLockService } from '../services/redis-lock.service';
import { NatsMessageHandler } from '../nats/nats-message.handler';
import { NatsService } from '../nats/nats.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Member, DataSource, SessionInfo, MemberFriend]),
    CommonModule,
  ],
  providers: [
    FriendService,
    FriendGateway,
    TokenCheckService,
    RedisFunctionService,
    GatewayInitiService,
    RedisLockService,
    NatsMessageHandler,
    NatsService,
  ],
})
export class FriendModule {}

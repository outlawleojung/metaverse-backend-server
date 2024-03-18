import { Module } from '@nestjs/common';
import { BlockchainGateway } from './blockchain.gateway';
import { BlockchainService } from './blockchain.service';
import { BlockchainController } from './blockchain.controller';
import { TokenCheckService } from '../manager/auth/tocket-check.service';
import { RedisFunctionService } from '@libs/redis';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member, SessionInfo } from '@libs/entity';
import { GatewayInitiService } from '../services/gateway-init.service';
import { RedisLockService } from '../services/redis-lock.service';
import { CommonModule } from '@libs/common';
import { NatsMessageHandler } from '../nats/nats-message.handler';
import { NatsService } from '../nats/nats.service';

@Module({
  imports: [TypeOrmModule.forFeature([Member, SessionInfo]), CommonModule],
  providers: [
    BlockchainGateway,
    BlockchainService,
    TokenCheckService,
    RedisFunctionService,
    GatewayInitiService,
    RedisLockService,
    RedisLockService,
    NatsMessageHandler,
    NatsService,
  ],
  controllers: [BlockchainController],
})
export class BlockchainModule {}

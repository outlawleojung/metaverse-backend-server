import { Member, SessionInfo, MemberOfficeReservationInfo } from '@libs/entity';
import { RedisFunctionService } from '@libs/redis';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenCheckService } from '../manager/auth/tocket-check.service';
import { DataSource } from 'typeorm';
import { OfficeService } from './office.service';
import { OfficeController } from './office.controller';
import { OfficeGateway } from './office.gateway';
import { OfficeWebService } from './office.web.service';
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
      MemberOfficeReservationInfo,
    ]),
  ],
  providers: [
    OfficeService,
    OfficeWebService,
    OfficeGateway,
    TokenCheckService,
    RedisFunctionService,
    NatsService,
    GatewayInitiService,
    RedisLockService,
    NatsMessageHandler,
  ],
  controllers: [OfficeController],
  exports: [OfficeGateway, OfficeService, OfficeWebService],
})
export class OfficeModule {}

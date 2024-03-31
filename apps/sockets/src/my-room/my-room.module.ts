import { Module } from '@nestjs/common';
import { MyRoomService } from './my-room.service';
import { MyRoomGateway } from './my-room.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member, SessionInfo } from '@libs/entity';
import { RoomModule } from '../room/room.module';
import { RedisLockService } from '../services/redis-lock.service';
import { TokenCheckService } from '../manager/auth/tocket-check.service';
import { NatsService } from '../nats/nats.service';
import { NatsMessageHandler } from '../nats/nats-message.handler';
import { GatewayInitiService } from '../services/gateway-init.service';

@Module({
  imports: [TypeOrmModule.forFeature([Member, SessionInfo]), RoomModule],
  providers: [
    MyRoomGateway,
    MyRoomService,
    RedisLockService,
    TokenCheckService,
    NatsService,
    NatsMessageHandler,
    GatewayInitiService,
  ],
})
export class MyRoomModule {}

import { Module } from '@nestjs/common';
import { PlayerService } from './player.service';
import { GatewayInitiService } from '../services/gateway-init.service';
import { RedisLockService } from '../services/redis-lock.service';
import { TokenCheckService } from '../unification/auth/tocket-check.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member, SessionInfo } from '@libs/entity';
import { NatsService } from '../nats/nats.service';
import { RedisFunctionService } from '@libs/redis';
import { ScheduleModule } from '@nestjs/schedule';
import { PlayerController } from './player.controller';
import { RoomService } from '../room/room.service';
import { RoomModule } from '../room/room.module';
import { NatsMessageHandler } from '../nats/nats-message.handler';
import { HubSocketModule } from '../hub-socket/hub-socket.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Member, SessionInfo]),
    ScheduleModule.forRoot(),
    RoomModule,
    HubSocketModule,
  ],
  controllers: [PlayerController],
  providers: [PlayerService, RoomService],
  exports: [PlayerService],
})
export class PlayerModule {}

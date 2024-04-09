import { Module } from '@nestjs/common';
import { PlayerService } from './player.service';
import { GatewayInitiService } from '../../../sockets/src/services/gateway-init.service';
import { RedisLockService } from '../../../sockets/src/services/redis-lock.service';
import { TokenCheckService } from '../../../sockets/src/unification/auth/tocket-check.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member, SessionInfo } from '@libs/entity';
import { NatsService } from '../../../sockets/src/nats/nats.service';
import { RedisFunctionService } from '@libs/redis';
import { ScheduleModule } from '@nestjs/schedule';
import { PlayerController } from './player.controller';
import { RoomService } from '../../../sockets/src/room/room.service';
import { RoomModule } from '../../../sockets/src/room/room.module';
import { NatsMessageHandler } from '../../../sockets/src/nats/nats-message.handler';
import { HubSocketModule } from '../../../sockets/src/hub-socket/hub-socket.module';

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

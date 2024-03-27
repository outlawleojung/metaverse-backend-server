import { Module } from '@nestjs/common';
import { PlayerService } from './player.service';
import { PlayerGateway } from './player.gateway';
import { GatewayInitiService } from '../services/gateway-init.service';
import { RedisLockService } from '../services/redis-lock.service';
import { TokenCheckService } from '../manager/auth/tocket-check.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member, SessionInfo } from '@libs/entity';
import { NatsService } from '../nats/nats.service';
import { RedisFunctionService } from '@libs/redis';
import { ScheduleModule } from '@nestjs/schedule';
import { PlayerController } from './player.controller';
import { RoomService } from '../room/room.service';
import { RoomModule } from '../room/room.module';
import { GameObjectService } from './game/game-object.service';
import { NatsMessageHandler } from '../nats/nats-message.handler';

@Module({
  imports: [
    TypeOrmModule.forFeature([Member, SessionInfo]),
    ScheduleModule.forRoot(),
    RoomModule,
  ],
  controllers: [PlayerController],
  providers: [
    PlayerGateway,
    PlayerService,
    GatewayInitiService,
    RedisLockService,
    TokenCheckService,
    NatsService,
    NatsMessageHandler,
    RedisFunctionService,
    RoomService,
    GameObjectService,
  ],
})
export class PlayerModule {}

import { RedisLockService } from './../services/redis-lock.service';
import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { RoomFactory } from './room.factory';
import { NatsService } from '../nats/nats.service';

@Module({
  controllers: [RoomController],
  providers: [RoomService, RoomFactory, NatsService, RedisLockService],
  exports: [RoomFactory, RoomService],
})
export class RoomModule {}

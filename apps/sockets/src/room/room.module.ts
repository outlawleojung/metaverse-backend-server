import { RedisLockService } from './../services/redis-lock.service';
import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { RoomFactory } from './room.factory';
import { NatsService } from '../nats/nats.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member, MemberAvatarInfo } from '@libs/entity';

@Module({
  imports: [TypeOrmModule.forFeature([Member, MemberAvatarInfo])],
  controllers: [RoomController],
  providers: [RoomService, RoomFactory, NatsService, RedisLockService],
  exports: [RoomFactory, RoomService],
})
export class RoomModule {}

import { RedisLockService } from './../services/redis-lock.service';
import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { RoomFactory } from './room.factory';
import { NatsService } from '../nats/nats.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member, MemberAvatarInfo } from '@libs/entity';
import { MyRoomService } from '../my-room/my-room.service';
import { HubSocketModule } from '../hub-socket/hub-socket.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Member, MemberAvatarInfo]),
    HubSocketModule,
  ],
  controllers: [RoomController],
  providers: [
    RoomService,
    RoomFactory,
    NatsService,
    RedisLockService,
    MyRoomService,
  ],
  exports: [RoomFactory, RoomService],
})
export class RoomModule {}

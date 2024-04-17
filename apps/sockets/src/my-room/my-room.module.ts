import { Module } from '@nestjs/common';
import { MyRoomService } from './my-room.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from '@libs/entity';
import { RoomModule } from '../room/room.module';
import { HubSocketModule } from '../hub-socket/hub-socket.module';

@Module({
  imports: [TypeOrmModule.forFeature([Member]), RoomModule, HubSocketModule],
  providers: [MyRoomService],
  exports: [MyRoomService],
})
export class MyRoomModule {}

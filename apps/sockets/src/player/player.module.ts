import { Module } from '@nestjs/common';
import { PlayerService } from './player.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from '@libs/entity';

import { ScheduleModule } from '@nestjs/schedule';
import { PlayerController } from './player.controller';
import { RoomService } from '../room/room.service';
import { RoomModule } from '../room/room.module';
import { HubSocketModule } from '../hub-socket/hub-socket.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Member]),
    ScheduleModule.forRoot(),
    RoomModule,
    HubSocketModule,
  ],
  controllers: [PlayerController],
  providers: [PlayerService, RoomService],
  exports: [PlayerService],
})
export class PlayerModule {}

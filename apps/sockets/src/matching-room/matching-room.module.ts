import { Module } from '@nestjs/common';
import { MatchingRoomService } from './matching-room.service';
import { MatchingRoomController } from './matching-room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JumpingMatchingLevel } from '@libs/entity';
import { HubSocketModule } from '../hub-socket/hub-socket.module';

@Module({
  imports: [TypeOrmModule.forFeature([JumpingMatchingLevel]), HubSocketModule],
  controllers: [MatchingRoomController],
  providers: [MatchingRoomService],
})
export class MatchingRoomModule {}

import { Module } from '@nestjs/common';
import { MyRoomService } from './my-room.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member, SessionInfo } from '@libs/entity';
import { RoomModule } from '../room/room.module';
import { TokenCheckService } from '../unification/auth/tocket-check.service';
import { GatewayInitiService } from '../services/gateway-init.service';
import { HubSocketModule } from '../hub-socket/hub-socket.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Member, SessionInfo]),
    RoomModule,
    HubSocketModule,
  ],
  providers: [MyRoomService],
  exports: [MyRoomService],
})
export class MyRoomModule {}

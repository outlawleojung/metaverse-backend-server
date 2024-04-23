import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Gateway,
  Admin,
  OsType,
  ServerType,
  ServerState,
  StateMessage,
} from '@libs/entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Gateway,
      Admin,
      OsType,
      ServerType,
      ServerState,
      StateMessage,
    ]),
  ],
  controllers: [GatewayController],
  providers: [GatewayService],
})
export class GatewayModule {}

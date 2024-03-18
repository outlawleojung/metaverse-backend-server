import { Module } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  EntityModule,
  Gateway,
  OsType,
  ServerInfo,
  ServerState,
  StateMessage,
  TestMember,
} from '@libs/entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Gateway,
      ServerInfo,
      ServerState,
      StateMessage,
      OsType,
      TestMember,
    ]),
    EntityModule,
  ],
  providers: [GatewayService],
  exports: [GatewayService],
})
export class GatewayModule {}

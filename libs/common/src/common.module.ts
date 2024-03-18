import { SessionModule } from './auth/session.module';
import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { JwtAuthModule } from './auth/jwt.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Member,
  MemberAccount,
  MemberAvatarPartsItemInven,
  MemberFurnitureItemInven,
  MemberMyRoomInfo,
  MemberWalletInfo,
  StartInventory,
  StartMyRoom,
  EntityModule,
  ResetPasswdCount,
  LicenseInfo,
  CSAFEventBoothInfo,
  MemberOfficeReservationInfo,
  CSAFEventInfo,
} from '@libs/entity';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomDataLogSchema, WorldChattingLogSchema } from '@libs/mongodb';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'worldChattingLog',
        schema: WorldChattingLogSchema,
      },
      {
        name: 'roomDataLog',
        schema: RoomDataLogSchema,
      },
    ]),
    TypeOrmModule.forFeature([
      Member,
      MemberAccount,
      MemberFurnitureItemInven,
      CSAFEventBoothInfo,
      CSAFEventInfo,
      MemberOfficeReservationInfo,
      MemberAvatarPartsItemInven,
      MemberMyRoomInfo,
      StartInventory,
      MemberWalletInfo,
      StartMyRoom,
      ResetPasswdCount,
      LicenseInfo,
    ]),
    SessionModule,
    JwtAuthModule,
    EntityModule,
  ],
  providers: [CommonService],
  exports: [CommonService, SessionModule, JwtAuthModule],
})
export class CommonModule {}

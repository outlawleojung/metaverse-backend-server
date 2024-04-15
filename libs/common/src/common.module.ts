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
  EmailCheck,
  EmailConfirm,
} from '@libs/entity';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomDataLogSchema, WorldChattingLogSchema } from '@libs/mongodb';
import { AuthService } from './auth/auth.service';
import { JwtService } from '@nestjs/jwt';

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
      EmailConfirm,
      EmailCheck,
    ]),
    SessionModule,
    EntityModule,
    JwtAuthModule,
  ],
  providers: [CommonService, JwtService, AuthService],
  exports: [
    CommonService,
    SessionModule,
    JwtAuthModule,
    JwtService,
    AuthService,
  ],
})
export class CommonModule {}

import { CommonService } from './../common/common.service';
import { CommonService as LibCommonService } from '@libs/common';
import { Module } from '@nestjs/common';
import { CsafLicenseController } from './csaf-license.controller';
import { CsafLicenseService } from './csaf-license.service';
import {
  LicenseFunction,
  LicenseType,
  LicenseTypeInfo,
  Member,
  MemberLicenseInfo,
  LicenseGroupInfo,
  LicenseInfo,
  User,
  CSAFEventInfo,
  MemberWalletInfo,
  MemberFurnitureItemInven,
  MemberAvatarPartsItemInven,
  MemberAccount,
} from '@libs/entity';
import { TypeOrmModule } from '@nestjs/typeorm';
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
      User,
      Member,
      MemberAccount,
      CSAFEventInfo,
      LicenseInfo,
      LicenseGroupInfo,
      MemberLicenseInfo,
      LicenseType,
      LicenseFunction,
      LicenseTypeInfo,
      MemberWalletInfo,
      MemberFurnitureItemInven,
      MemberAvatarPartsItemInven,
    ]),
  ],
  controllers: [CsafLicenseController],
  providers: [CsafLicenseService, CommonService, LibCommonService],
})
export class CsafLicenseModule {}

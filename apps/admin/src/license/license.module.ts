import { Module } from '@nestjs/common';
import { LicenseController } from './license.controller';
import { LicenseService } from './license.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  LicenseFunction,
  LicenseType,
  LicenseTypeInfo,
  Member,
  MemberLicenseInfo,
  OfficeLicenseDomainInfo,
  LicenseGroupInfo,
  LicenseInfo,
  Admin,
} from '@libs/entity';
import { CommonService } from '../common/common.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Admin,
      Member,
      OfficeLicenseDomainInfo,
      LicenseInfo,
      LicenseGroupInfo,
      MemberLicenseInfo,
      LicenseType,
      LicenseFunction,
      LicenseTypeInfo,
    ]),
  ],
  controllers: [LicenseController],
  providers: [LicenseService, CommonService],
})
export class LicenseModule {}

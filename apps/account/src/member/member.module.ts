import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AvatarPartsType,
  EntityModule,
  Member,
  MemberAccount,
  MemberAvatarInfo,
  MemberWalletInfo,
  EmailConfirm,
  AvatarPreset,
  BusinessCardTemplate,
  CSAFEventInfo,
  MemberLicenseInfo,
  LicenseInfo,
  LicenseGroupInfo,
  NoticeInfo,
} from '@libs/entity';
import { CommonModule } from '@libs/common';
import { LoginTokenService } from '../auth/login-token.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Member,
      MemberAccount,
      AvatarPartsType,
      MemberAvatarInfo,
      EmailConfirm,
      AvatarPreset,
      BusinessCardTemplate,
      MemberWalletInfo,
      CSAFEventInfo,
      MemberLicenseInfo,
      LicenseInfo,
      LicenseGroupInfo,
      NoticeInfo,
    ]),
    EntityModule,
    CommonModule,
  ],
  providers: [MemberService, LoginTokenService],
  exports: [MemberService],
})
export class MemberModule {}

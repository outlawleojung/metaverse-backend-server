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
  MemberRepository,
  MemberAccountRepository,
  MemberBusinessCardInfoRepository,
  MemberBusinessCardInfo,
} from '@libs/entity';
import { CommonModule } from '@libs/common';

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
      MemberBusinessCardInfo,
    ]),
    EntityModule,
    CommonModule,
  ],
  providers: [
    MemberService,
    MemberRepository,
    MemberAccountRepository,
    MemberBusinessCardInfoRepository,
  ],
  exports: [MemberService],
})
export class MemberModule {}

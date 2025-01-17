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
  MemberAvatarInfoRepository,
  MemberDefaultCardInfoRepository,
  MemberAvatarPartsItemInvenRepository,
  MemberDefaultCardInfo,
  StartInventory,
  MemberAvatarPartsItemInven,
  MemberMyRoomInfoRepository,
  StartMyRoom,
  MemberMyRoomInfo,
  MemberFurnitureItemInven,
  MemberFrameImageRepository,
  MemberFrameImage,
  MemberFurnitureItemInvenRepository,
  MemberMoneyRepository,
  MemberMoney,
  MoneyType,
} from '@libs/entity';

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
      MemberDefaultCardInfo,
      StartInventory,
      MemberAvatarPartsItemInven,
      StartMyRoom,
      MemberMyRoomInfo,
      MemberFurnitureItemInven,
      MemberFrameImage,
      MemberMoney,
      MoneyType,
    ]),
    EntityModule,
  ],
  providers: [
    MemberService,
    MemberRepository,
    MemberAccountRepository,
    MemberBusinessCardInfoRepository,
    MemberAvatarInfoRepository,
    MemberDefaultCardInfoRepository,
    MemberAvatarPartsItemInvenRepository,
    MemberMyRoomInfoRepository,
    MemberFrameImageRepository,
    MemberFurnitureItemInvenRepository,
    MemberMoneyRepository,
  ],
  exports: [MemberService],
})
export class MemberModule {}

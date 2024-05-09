import {
  EntityModule,
  MemberPasswordAuth,
  MemberLoginRewardLog,
  MemberNftRewardLog,
  MemberRepository,
  MemberAccountRepository,
  EmailCheckRepository,
  EmailConfirmRepository,
  EmailLimitRepository,
  EmailLimit,
  MemberPasswordAuthRepository,
  MemberAvatarInfoRepository,
} from '@libs/entity';
import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Member,
  MemberAvatarInfo,
  MemberAccount,
  MemberFurnitureItemInven,
  StartInventory,
  StartMyRoom,
  EmailCheck,
  EmailConfirm,
  MemberMyRoomInfo,
} from '@libs/entity';
import { CommonModule } from '@libs/common';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Member,
      MemberAvatarInfo,
      MemberAccount,
      MemberFurnitureItemInven,
      MemberMyRoomInfo,
      StartInventory,
      StartMyRoom,
      EmailCheck,
      EmailConfirm,
      EmailLimit,
      MemberPasswordAuth,
      MemberLoginRewardLog,
      MemberNftRewardLog,
      MemberPasswordAuth,
    ]),
    EntityModule,
    CommonModule,
    MailModule,
  ],
  controllers: [AccountController],
  providers: [
    AccountService,
    MemberRepository,
    MemberAccountRepository,
    EmailCheckRepository,
    EmailConfirmRepository,
    EmailLimitRepository,
    MemberPasswordAuthRepository,
    MemberAvatarInfoRepository,
  ],
  exports: [AccountService],
})
export class AccountModule {}

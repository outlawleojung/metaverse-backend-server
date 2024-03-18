import {
  SessionInfo,
  EntityModule,
  MemberPasswordAuth,
  MemberLoginRewardLog,
  MemberNftRewardLog,
} from '@libs/entity';
import { LoginTokenModule } from './../auth/login-token.module';
import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { LoginTokenService } from '../auth/login-token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Member,
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
      MemberAccount,
      MemberFurnitureItemInven,
      MemberMyRoomInfo,
      StartInventory,
      StartMyRoom,
      EmailCheck,
      EmailConfirm,
      SessionInfo,
      MemberPasswordAuth,
      MemberLoginRewardLog,
      MemberNftRewardLog,
    ]),
    LoginTokenModule,
    EntityModule,
    CommonModule,
    MailModule,
  ],
  controllers: [AccountController],
  providers: [AccountService, LoginTokenService],
  exports: [AccountService, LoginTokenService],
})
export class AccountModule {}

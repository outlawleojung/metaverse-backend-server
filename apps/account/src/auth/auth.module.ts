import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { MemberService } from '../member/member.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AvatarPartsType,
  AvatarPreset,
  BusinessCardTemplate,
  CSAFEventInfo,
  EmailCheck,
  EmailConfirm,
  EntityModule,
  LicenseGroupInfo,
  LicenseInfo,
  Member,
  MemberAccount,
  MemberAvatarInfo,
  MemberLicenseInfo,
  MemberWalletInfo,
  NoticeInfo,
} from '@libs/entity';
import { MemberModule } from '../member/member.module';
import { CommonModule } from '@libs/common';
import { LoginTokenService } from './login-token.service';
import { AccountService } from '../account/account.service';
import { MailService } from '../mail/mail.service';

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([
      Member,
      MemberAccount,
      AvatarPartsType,
      MemberAvatarInfo,
      EmailConfirm,
      EmailCheck,
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
    MemberModule,
    CommonModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    MemberService,
    LoginTokenService,
    AccountService,
    MailService,
  ],
})
export class AuthModule {}

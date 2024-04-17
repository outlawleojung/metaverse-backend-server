import {
  EntityModule,
  MemberPasswordAuth,
  MemberLoginRewardLog,
  MemberNftRewardLog,
} from '@libs/entity';
import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
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
      MemberPasswordAuth,
      MemberLoginRewardLog,
      MemberNftRewardLog,
    ]),
    EntityModule,
    CommonModule,
    MailModule,
  ],
  controllers: [AccountController],
  providers: [AccountService],
  exports: [AccountService],
})
export class AccountModule {}

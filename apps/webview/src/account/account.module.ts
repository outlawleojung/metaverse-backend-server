import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Member,
  MemberAccount,
  EmailCheck,
  EmailConfirm,
  EntityModule,
  MemberMyRoomInfo,
  StartMyRoom,
  StartInventory,
} from '@libs/entity';
import { CommonModule } from '@libs/common';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Member,
      MemberAccount,
      MemberMyRoomInfo,
      StartInventory,
      StartMyRoom,
      EmailCheck,
      EmailConfirm,
    ]),
    MailModule,
    CommonModule,
    EntityModule,
  ],
  controllers: [AccountController],
  providers: [AccountService],
  exports: [AccountService],
})
export class AccountModule {}

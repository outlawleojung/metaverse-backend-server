import { PostboxSendService } from './../services/postbox.send.service';
import { Module } from '@nestjs/common';
import { PostboxController } from './postbox.controller';
import { PostboxService } from './postbox.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AppendType,
  Postbox,
  PostboxAppend,
  MoneyType,
  PostalEffectType,
  PostalItemProperty,
  PostalLog,
  PostalLogType,
  PostalMoneyProperty,
  PostalState,
  PostalSendType,
  PostalType,
  PostalTypeProperty,
  User,
  PostReceiveMemberInfo,
  MemberPostbox,
} from '@libs/entity';
import { PostalLogService } from './postal.log.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Postbox,
      PostboxAppend,
      PostalType,
      PostalEffectType,
      PostalItemProperty,
      PostalLog,
      PostalLogType,
      PostalMoneyProperty,
      PostalState,
      PostalSendType,
      PostalTypeProperty,
      PostReceiveMemberInfo,
      MemberPostbox,
      AppendType,
      MoneyType,
    ]),
  ],
  controllers: [PostboxController],
  providers: [PostboxService, PostalLogService, PostboxSendService],
  exports: [PostboxService, PostalLogService, PostboxSendService],
})
export class PostboxModule {}

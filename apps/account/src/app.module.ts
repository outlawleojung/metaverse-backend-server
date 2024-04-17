import { APP_INTERCEPTOR } from '@nestjs/core';

import {
  EntityModule,
  Member,
  MemberAccount,
  MemberAvatarPartsItemInven,
  MemberFurnitureItemInven,
  MemberMyRoomInfo,
  MemberWalletInfo,
  StartInventory,
  StartMyRoom,
} from '@libs/entity';
import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountController } from './account/account.controller';
import { AccountModule } from './account/account.module';
import { CommonModule, CommonService } from '@libs/common';
import { MorganModule, MorganInterceptor } from 'nest-morgan';
import { MemberController } from './member/member.controller';
import { MemberModule } from './member/member.module';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from './mail/mail.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks/tasks.service';
import { ScheduleModule } from '@nestjs/schedule';
import {
  RoomDataLogSchema,
  SchemaModule,
  WorldChattingLogSchema,
} from '@libs/mongodb';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    MongooseModule.forFeature([
      { name: 'worldChattingLog', schema: WorldChattingLogSchema },
      { name: 'roomDataLog', schema: RoomDataLogSchema },
    ]),
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([
      Member,
      MemberAccount,
      MemberFurnitureItemInven,
      MemberAvatarPartsItemInven,
      MemberMyRoomInfo,
      MemberWalletInfo,
      StartInventory,
      StartMyRoom,
    ]),
    MorganModule,
    EntityModule,
    AccountModule,
    MemberModule,
    MailModule,
    SchemaModule,
    CommonModule,
  ],
  controllers: [AppController, AccountController, MemberController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: MorganInterceptor('combined'),
    },
    AppService,
    CommonService,
    TasksService,
  ],
})
export class AppModule {}

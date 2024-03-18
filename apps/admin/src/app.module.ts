import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { GatewayModule } from './gateway/gateway.module';
import { UserModule } from './user/user.module';
import { VoteModule } from './vote/vote.module';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MorganInterceptor, MorganModule } from 'nest-morgan';
import { AzureBlobService } from '@libs/common';
import { EntityModule } from '@libs/entity';
import { MemberModule } from './member/member.module';
import { InquiryModule } from './inquiry/inquiry.module';
import { ReportModule } from './report/report.module';
import { TasksService } from './tasks/tasks.service';
import { RolesModule } from './auth/roles.module';
import { LicenseModule } from './license/license.module';
import { PostboxModule } from './postbox/postbox.module';
import { PostboxSendService } from './services/postbox.send.service';
import { PaymentsController } from './payments/payments.controller';
import { PaymentsModule } from './payments/payments.module';
import { ScreenBannerModule } from './screen-banner/screen-banner.module';
import { SelectVoteModule } from './select-vote/select-vote.module';
import { AzureStorageModule } from './azure-storage/azure-storage.module';
import { CsafLicenseModule } from './csaf-license/csaf-license.module';
import { MongooseModule } from '@nestjs/mongoose';
import { NoticeModule } from './notice/notice.module';
import { NatsModule } from './nats/nats.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URL),
    ScheduleModule.forRoot(),
    EntityModule,
    AdminModule,
    AuthModule,
    GatewayModule,
    UserModule,
    VoteModule,
    MorganModule,
    MemberModule,
    InquiryModule,
    ReportModule,
    RolesModule,
    LicenseModule,
    PostboxModule,
    PaymentsModule,
    ScreenBannerModule,
    SelectVoteModule,
    AzureStorageModule,
    CsafLicenseModule,
    NoticeModule,
    MailModule,
    NatsModule,
  ],
  controllers: [AppController, PaymentsController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: MorganInterceptor('combined'),
    },
    AzureBlobService,
    TasksService,
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MorganInterceptor, MorganModule } from 'nest-morgan';
import { EntityModule } from '@libs/entity';
import { AzureBlobService } from '@libs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AccountModule } from './account/account.module';
import { AuthModule } from './auth/auth.module';
import { InquiryModule } from './inquiry/inquiry.module';
import { ReportModule } from './report/report.module';
import { SchemaModule } from '@libs/mongodb';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    MorganModule,
    EntityModule,
    AccountModule,
    AuthModule,
    InquiryModule,
    ReportModule,
    SchemaModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AzureBlobService,
    {
      provide: APP_INTERCEPTOR,
      useClass: MorganInterceptor('combined'),
    },
  ],
})
export class AppModule {}

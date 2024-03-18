import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MorganInterceptor, MorganModule } from 'nest-morgan';
import { AzureBlobService } from '@libs/common';
import { EntityModule } from '@libs/entity';
import { PaymentController } from './payment/payment.controller';
import { PaymentModule } from './payment/payment.module';
import { IapController } from './iap/iap.controller';
import { IapModule } from './iap/iap.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    EntityModule,
    PaymentModule,
    IapModule,
    MorganModule,
  ],
  controllers: [AppController, PaymentController, IapController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: MorganInterceptor('combined'),
    },
    AzureBlobService,
  ],
})
export class AppModule {}

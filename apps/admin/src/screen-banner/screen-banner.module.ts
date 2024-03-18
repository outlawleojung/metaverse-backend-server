import { Module } from '@nestjs/common';
import { ScreenBannerController } from './screen-banner.controller';
import { ScreenBannerService } from './screen-banner.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BannerReservation, ScreenReservation, User } from '@libs/entity';
import { NatsService } from '../nats/nats.service';
import { NatsModule } from '../nats/nats.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, ScreenReservation, BannerReservation]),
    NatsModule,
  ],
  controllers: [ScreenBannerController],
  providers: [ScreenBannerService, NatsService],
  exports: [ScreenBannerService],
})
export class ScreenBannerModule {}

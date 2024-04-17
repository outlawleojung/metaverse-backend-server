import { Module } from '@nestjs/common';
import { ScreenBannerService } from './screen-banner.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  BannerInfo,
  BannerReservation,
  Member,
  ScreenInfo,
  ScreenReservation,
} from '@libs/entity';
import { DataSource } from 'typeorm';
import { HubSocketModule } from '../hub-socket/hub-socket.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Member,
      DataSource,
      ScreenInfo,
      BannerInfo,
      ScreenReservation,
      BannerReservation,
    ]),
    HubSocketModule,
  ],
  providers: [ScreenBannerService],
  exports: [ScreenBannerService],
})
export class ScreenBannerModule {}

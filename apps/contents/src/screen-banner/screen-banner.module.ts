import { Module } from '@nestjs/common';
import { ScreenBannerController } from './screen-banner.controller';
import { ScreenBannerService } from './screen-banner.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  EntityModule,
  BannerReservation,
  ScreenReservation,
  Admin,
} from '@libs/entity';
import { CommonModule } from '@libs/common';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin, ScreenReservation, BannerReservation]),
    EntityModule,
    CommonModule,
  ],
  controllers: [ScreenBannerController],
  providers: [ScreenBannerService],
  exports: [ScreenBannerService],
})
export class ScreenBannerModule {}

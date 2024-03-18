import { Module } from '@nestjs/common';
import { ScreenBannerController } from './screen-banner.controller';
import { ScreenBannerService } from './screen-banner.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  EntityModule,
  BannerReservation,
  ScreenReservation,
  User,
} from '@libs/entity';
import { CommonModule } from '@libs/common';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, ScreenReservation, BannerReservation]),
    EntityModule,
    CommonModule,
  ],
  controllers: [ScreenBannerController],
  providers: [ScreenBannerService],
  exports: [ScreenBannerService],
})
export class ScreenBannerModule {}

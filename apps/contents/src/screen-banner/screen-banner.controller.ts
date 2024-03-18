import {
  Body,
  Controller,
  Get,
  Post,
  HttpStatus,
  Logger,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MorganInterceptor } from 'nest-morgan';
import { ScreenBannerService } from './screen-banner.service';
import { GetScreenBannerConstantsResponseDto } from './dto/res/get.constants.response.dto';
import { CreateScreenReservationDTO } from './dto/req/create.screen.dto';
import { GetScreenResponseDto } from './dto/res/get.screen.response.dto';
import { JwtGuard } from '@libs/common';

@ApiTags('SCREEN-BANNER - 스크린 & 배너')
@UseInterceptors(MorganInterceptor('combined'))
@Controller('api/screen-banner')
export class ScreenBannerController {
  constructor(private screenBannerService: ScreenBannerService) {}
  private readonly logger = new Logger(ScreenBannerController.name);

  @ApiOperation({ summary: '스크린 상수 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    isArray: true,
    type: GetScreenBannerConstantsResponseDto,
  })
  @UseGuards(JwtGuard)
  @Get('constant')
  async getConstant() {
    return await this.screenBannerService.getConstants();
  }

  @ApiOperation({ summary: '전체 스크린 예약 목록 가져오기' })
  @ApiResponse({
    status: HttpStatus.OK,
    isArray: true,
    type: GetScreenResponseDto,
  })
  @UseGuards(JwtGuard)
  @Get('getScreen')
  async getScreenReservations() {
    return await this.screenBannerService.getScreenReservation();
  }
}

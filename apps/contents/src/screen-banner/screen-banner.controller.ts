import {
  Controller,
  Get,
  HttpStatus,
  Logger,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MorganInterceptor } from 'nest-morgan';
import { ScreenBannerService } from './screen-banner.service';
import { GetScreenBannerConstantsResponseDto } from './dto/res/get.constants.response.dto';
import { GetScreenResponseDto } from './dto/res/get.screen.response.dto';
import { AccessTokenGuard } from '@libs/common';

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
  @UseGuards(AccessTokenGuard)
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
  @UseGuards(AccessTokenGuard)
  @Get('getScreen')
  async getScreenReservations() {
    return await this.screenBannerService.getScreenReservation();
  }
}

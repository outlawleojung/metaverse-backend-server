import {
  Body,
  Controller,
  Get,
  Query,
  Post,
  Patch,
  Delete,
  HttpStatus,
  Logger,
  UseGuards,
  UseInterceptors,
  Param,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MorganInterceptor } from 'nest-morgan';
import { ScreenBannerService } from './screen-banner.service';
import { LoggedInGuard } from '../auth/logged-in.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { GetScreenBannerConstantsResponseDto } from './dto/res/get.constants.response.dto';
import { CreateScreenReservationDTO } from './dto/req/create.screen.dto';
import { GetScreenResponseDto } from './dto/res/get.screen.response.dto';
import { CreateBannerReservationDTO } from './dto/req/create.banner.dto';
import { AdminDecorator } from '../common/decorators/admin.decorator';
import { UpdateBannerReservationDTO } from './dto/req/update.banner.dto';
import { UpdateScreenReservationDTO } from './dto/req/update.screen.dto';
import { GetScreenBannerDTO } from './dto/req/get.screen.dto';
import { ROLE_TYPE } from '@libs/constants';

@ApiTags('SCREEN-BANNER - 스크린 & 배너')
@UseInterceptors(MorganInterceptor('combined'))
@Controller('api/screen-banner')
export class ScreenBannerController {
  constructor(private screenBannerService: ScreenBannerService) {}
  private readonly logger = new Logger(ScreenBannerController.name);

  @ApiOperation({ summary: '스크린 & 배너 상수 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    isArray: true,
    type: GetScreenBannerConstantsResponseDto,
  })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Get('constant')
  async getConstant() {
    return await this.screenBannerService.getConstants();
  }

  @ApiOperation({ summary: '전체 스크린 예약 목록 조회' })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Get('screen')
  async getScreenReservations(@Query() data: GetScreenBannerDTO) {
    return await this.screenBannerService.getScreenReservations(data);
  }

  @ApiOperation({ summary: '스크린 예약 생성' })
  @ApiResponse({
    status: HttpStatus.OK,
    isArray: true,
    type: GetScreenResponseDto,
  })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Post('createScreen')
  async createScreen(
    @AdminDecorator() admin,
    @Body() data: CreateScreenReservationDTO,
  ) {
    return await this.screenBannerService.createScreenReservation(
      admin.id,
      data,
    );
  }

  @ApiOperation({ summary: '스크린 예약 수정하기' })
  @ApiResponse({
    status: HttpStatus.OK,
    isArray: true,
    type: GetScreenResponseDto,
  })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Patch('updateScreen/:reservId')
  async updateScreen(
    @AdminDecorator() admin,
    @Body() data: UpdateScreenReservationDTO,
    @Param('reservId') reservId: number,
  ) {
    return await this.screenBannerService.updateScreenReservation(
      admin.id,
      data,
      reservId,
    );
  }

  @ApiOperation({ summary: '스크린 예약 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    isArray: true,
    type: GetScreenResponseDto,
  })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Get('getScreen/:screenId')
  async getScreenReservation(@Param('screenId') screenId: number) {
    return await this.screenBannerService.getScreenReservation(screenId);
  }

  @ApiOperation({ summary: '스크린 예약 삭제' })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Delete('screen/:reservId')
  async deleteScreenReservation(@Param('reservId') screenId: number) {
    return await this.screenBannerService.deleteScreenReservation(screenId);
  }

  @ApiOperation({ summary: '전체 배너 예약 목록' })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Get('banner')
  async getBannerReservations(@Query() data: GetScreenBannerDTO) {
    return await this.screenBannerService.getBannerReservations(data);
  }

  @ApiOperation({ summary: '배너 예약 조회' })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Get('getBanner/:bannerId')
  async getBanner(@Param('bannerId') bannerId: number) {
    return await this.screenBannerService.getBannerReservation(bannerId);
  }

  @ApiOperation({ summary: '배너 예약 생성' })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Post('createBanner')
  async createBanner(
    @AdminDecorator() admin,
    @Body() data: CreateBannerReservationDTO,
  ) {
    return await this.screenBannerService.createBannerReservation(
      admin.id,
      data,
    );
  }

  @ApiOperation({ summary: '배너 예약 수정하기' })
  // @UseGuards(LoggedInGuard)
  // @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Patch('updateBanner/:reservId')
  async updateBanner(
    @AdminDecorator() admin,
    @Body() data: UpdateBannerReservationDTO,
    @Param('reservId') reservId: number,
  ) {
    return await this.screenBannerService.updateBannerReservation(
      admin.id,
      data,
      reservId,
    );
  }

  @ApiOperation({ summary: '배너 예약 삭제' })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Delete('banner')
  async deleteBannerReservation(@Query('reservIds') reservIds: string) {
    return await this.screenBannerService.deleteBannerReservation(reservIds);
  }
}

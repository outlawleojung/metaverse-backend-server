import { CreateEventDto } from './dto/req/create.event.dto';
import { GetLicenseDto } from './../license/req/get.license.dto';
import { UserDecorator } from '../common/decorators/user.decorator';
import { LoggedInGuard } from '../auth/logged-in.guard';
import { Roles } from '../common/decorators/roles.decorator';
import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MorganInterceptor } from 'nest-morgan';
import { CsafLicenseService } from './csaf-license.service';
import { GetConstantsResponseDto } from '../license/res/get.constants.response.dto';
import { ROLE_TYPE } from '@libs/constants';
import { CreateLicenseDto } from './dto/req/create.license.dto';
import { User } from '@libs/entity';
import { UpdateEventDto } from './dto/req/update.event.dto';
import { DeleteLicenseDto } from '../license/req/delete.license.dto';
import { UpdateLicenseDto } from './dto/req/update.license.dto';
import { GetEventLicenseResponseDto } from './dto/res/get.event.license.response.dto';
import { GetEventDto } from './dto/req/get.event.dto';

@ApiTags('EVENT LICENSE - 행사 라이선스')
@UseInterceptors(MorganInterceptor('combined'))
@Controller('api/csaf-license')
export class CsafLicenseController {
  constructor(private csafLicenseService: CsafLicenseService) {}
  private readonly logger = new Logger(CsafLicenseController.name);

  @ApiOperation({ summary: '라이선스 상수 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetConstantsResponseDto,
  })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.SUPER_ADMIN)
  @Get('constants')
  async getConstants() {
    return await this.csafLicenseService.getConstants();
  }

  @ApiOperation({ summary: '라이선스 발급' })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.SUPER_ADMIN)
  @Post()
  async createLicense(@UserDecorator() user, @Body() data: CreateLicenseDto) {
    return await this.csafLicenseService.createLicense(user.id, data);
  }

  @ApiOperation({ summary: '전체 라이선스 목록 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.SUPER_ADMIN)
  @Get()
  async getLicenses(@Query() data: GetLicenseDto) {
    return await this.csafLicenseService.getLicenses(
      data.page,
      data.searchType,
      data.searchValue,
      data.searchDateTime,
      data.licenseType,
      data.stateType,
    );
  }

  @ApiOperation({ summary: '라이선스 관리 목록 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.SUPER_ADMIN)
  @Get('/management')
  async getManagementLicenses(@Query() data: GetLicenseDto) {
    return await this.csafLicenseService.getManagementLicenses(
      data.page,
      data.searchType,
      data.searchValue,
      data.searchDateTime,
      data.licenseType,
      data.stateType,
    );
  }

  @ApiOperation({ summary: '라이선스 관리 항목 수정' })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.SUPER_ADMIN)
  @Patch(':id')
  async updateLicense(
    @UserDecorator() user,
    @Body() data: UpdateLicenseDto,
    @Param('id') id: number,
    @Query() query: GetLicenseDto,
    @Res() res,
  ) {
    const result = await this.csafLicenseService.updateLicense(
      user.id,
      id,
      data,
    );
    if (result) {
      let searchType = '';
      let searchValue = '';
      let licenseType = '';
      let searchDateTime = '';
      let stateType = '';

      if (query.searchType) searchType = `&searchType=${query.searchType}`;
      if (query.searchValue) searchValue = `&searchValue=${query.searchValue}`;
      if (query.licenseType) licenseType = `&licenseType=${query.licenseType}`;
      if (query.searchDateTime)
        searchDateTime = `&searchDateTime=${query.searchDateTime}`;
      if (query.stateType) stateType = `&stateType=${query.stateType}`;

      res.redirect(
        HttpStatus.SEE_OTHER,
        `/api/csaf-license/management?page=${query.page}${searchType}${searchValue}${licenseType}${searchDateTime}${stateType}`,
      );
    } else {
      throw new ForbiddenException('DB 실패!!');
    }
  }

  @ApiOperation({ summary: '라이선스 삭제' })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.SUPER_ADMIN)
  @Post('/deleteLicense')
  async deleteLicense(
    @Body() data: DeleteLicenseDto,
    @Query() query: GetLicenseDto,
    @Res() res,
  ) {
    const result = await this.csafLicenseService.deleteLicense(data.licenseIds);
    if (result) {
      let searchType = '';
      let searchValue = '';
      let licenseType = '';
      let searchDateTime = '';
      let stateType = '';

      if (query.searchType) searchType = `&searchType=${query.searchType}`;
      if (query.searchValue) searchValue = `&searchValue=${query.searchValue}`;
      if (query.licenseType) licenseType = `&licenseType=${query.licenseType}`;
      if (query.searchDateTime)
        searchDateTime = `&searchDateTime=${query.searchDateTime}`;
      if (query.stateType) stateType = `&stateType=${query.stateType}`;

      res.redirect(
        HttpStatus.SEE_OTHER,
        `/api/csaf-license/management?page=${query.page}${searchType}${searchValue}${licenseType}${searchDateTime}${stateType}`,
      );
    } else {
      throw new ForbiddenException('DB 실패!!');
    }
  }

  @ApiOperation({ summary: '행사 목록 조회' })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.SUPER_ADMIN)
  @Get('event')
  async getDomains(@Query() data: GetEventDto) {
    return await this.csafLicenseService.getEvents(
      data.page,
      data.searchType,
      data.searchValue,
      data.searchDateTime,
      data.stateType,
    );
  }

  @ApiOperation({ summary: '행사 등록' })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.SUPER_ADMIN)
  @Post('event')
  async createDomain(
    @UserDecorator() user: User,
    @Body() data: CreateEventDto,
    @Res() res,
  ) {
    const result = await this.csafLicenseService.createEvent(user.id, data);
    if (result) {
      console.log(result);
      if (data.callType === 0) {
        res.redirect(HttpStatus.SEE_OTHER, `/api/csaf-license/event?page=1`);
      } else {
        console.log(data.callType);
        res.send('success');
      }
    } else {
      throw new ForbiddenException();
    }
  }

  @ApiOperation({ summary: '행사 변경' })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.SUPER_ADMIN)
  @Patch('event/:id')
  async updateDomain(
    @UserDecorator() user: User,
    @Body() data: UpdateEventDto,
    @Param('id') id: number,
    @Res() res,
  ) {
    const result = await this.csafLicenseService.updateEvent(user.id, id, data);
    if (result) {
      let searchType = '';
      let searchValue = '';

      if (data.searchType) searchType = `&searchType=${data.searchType}`;
      if (data.searchValue) searchValue = `&searchValue=${data.searchValue}`;

      res.redirect(
        HttpStatus.SEE_OTHER,
        `/api/csaf-license/event?page=${data.page}${searchType}${searchValue}`,
      );
    } else {
      throw new ForbiddenException();
    }
  }

  @ApiOperation({ summary: '행사 라이선스 목록 조회 - 다운로드용' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetEventLicenseResponseDto,
  })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.SUPER_ADMIN)
  @Get('event/license/:groupId')
  async getEventLicense(@Param('groupId') groupId: number) {
    return await this.csafLicenseService.getEventLicense(groupId);
  }

  @ApiOperation({ summary: '행사 로그 조회 - 다운로드용' })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.SUPER_ADMIN)
  @Get('event/log/:eventId')
  async getEventLog(@Param('eventId') eventId: number) {
    return await this.csafLicenseService.getEventLog(eventId);
  }
}

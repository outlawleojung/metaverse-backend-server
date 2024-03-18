import {
  Controller,
  UseInterceptors,
  Logger,
  Post,
  Patch,
  Body,
  UseGuards,
  Param,
  Get,
  Query,
  HttpStatus,
  Res,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiExcludeEndpoint,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { MorganInterceptor } from 'nest-morgan';
import { LicenseService } from './license.service';
import { LoggedInGuard } from '../auth/logged-in.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ROLE_TYPE } from '@libs/constants';
import { UserDecorator } from '../common/decorators/user.decorator';
import { User } from '@libs/entity';
import { GetTableDto } from '../common/dto/get.table.dto';
import { CreateDomainDto } from './req/create.domain.dto';
import { UpdateDomainDto } from './req/update.domain.dto';
import { CreateLicenseDto } from './req/create.license.dto';
import { DeleteDomainDto } from './req/delete.domain.dto';
import { GetLicenseDto } from './req/get.license.dto';
import { GetLicenseResponseDto } from './res/get.license.response.dto';
import { GetLicenseAffilicationResponseDto } from './res/get.affiliation.license.response.dto';
import { UpdateLicenseDto } from './req/update.license.dto';
import { GetConstantsResponseDto } from './res/get.constants.response.dto';
import { DeleteLicenseDto } from './req/delete.license.dto';
import { GetLicenseAffiliationResponseDto } from './res/get.license.affiliation.response.dto';

@ApiTags('LICENSE - 라이선스')
@UseInterceptors(MorganInterceptor('combined'))
@Controller('api/license')
export class LicenseController {
  constructor(private licenseService: LicenseService) {}
  private readonly logger = new Logger(LicenseController.name);

  @ApiOperation({ summary: '라이선스 상수 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetConstantsResponseDto,
  })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Get('constants')
  async getConstants() {
    return this.licenseService.getConstants();
  }

  @ApiOperation({ summary: '라이선스 발급' })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN, ROLE_TYPE.SUPER_ADMIN)
  @Post()
  async createLicense(@UserDecorator() user, @Body() data: CreateLicenseDto) {
    return await this.licenseService.createLicense(user.id, data);
  }

  @ApiOperation({ summary: '소속별 라이선스 목록 조회 - 다운로드용' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetLicenseAffiliationResponseDto,
  })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Get('affiliation/:groupId')
  async getLicense(@Param('groupId') groupId: number) {
    return this.licenseService.getLicense(groupId);
  }

  @ApiOperation({ summary: '전체 라이선스 목록 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetLicenseResponseDto,
  })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Get()
  async getLicenses(@Query() data: GetLicenseDto) {
    return this.licenseService.getLicenses(
      data.page,
      data.searchType,
      data.searchValue,
      data.searchDateTime,
      data.licenseType,
      data.stateType,
    );
  }

  @ApiOperation({ summary: '소속 라이선스 목록 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetLicenseAffilicationResponseDto,
  })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Get('/affiliation')
  async getAffiliationLicenses(@Query() data: GetLicenseDto) {
    return await this.licenseService.getAffiliationLicenses(
      data.page,
      data.searchType,
      data.searchValue,
      data.searchDateTime,
      data.licenseType,
      data.stateType,
    );
  }

  @ApiOperation({ summary: '라이선스 수정' })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Patch(':id')
  async updateLicense(
    @UserDecorator() user,
    @Body() data: UpdateLicenseDto,
    @Param('id') id: number,
    @Query() query: GetLicenseDto,
    @Res() res,
  ) {
    const result = await this.licenseService.updateLicense(user.id, id, data);
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
        `/api/license/affiliation?page=${query.page}${searchType}${searchValue}${licenseType}${searchDateTime}${stateType}`,
      );
    } else {
      throw new ForbiddenException('DB 실패!!');
    }
  }

  @ApiOperation({ summary: '라이선스 삭제' })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Post('/deleteLicense')
  async deleteLicense(
    @Body() data: DeleteLicenseDto,
    @Query() query: GetLicenseDto,
    @Res() res,
  ) {
    const result = await this.licenseService.deleteLicense(data.licenseIds);
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
        `/api/license/affiliation?page=${query.page}${searchType}${searchValue}${licenseType}${searchDateTime}${stateType}`,
      );
    } else {
      throw new ForbiddenException('DB 실패!!');
    }
  }

  @ApiOperation({ summary: '도메인 목록 조회' })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Get('domain')
  async getDomains(@Query() data: GetTableDto) {
    return this.licenseService.getDomains(
      data.page,
      data.searchType,
      data.searchValue,
    );
  }

  @ApiOperation({ summary: '도메인 등록' })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Post('domain')
  async createDomain(
    @UserDecorator() user: User,
    @Body() data: CreateDomainDto,
    @Res() res,
  ) {
    const result = await this.licenseService.createDomain(user.id, data);
    if (result) {
      console.log(result);
      if (data.callType === 0) {
        res.redirect(HttpStatus.SEE_OTHER, `/api/license/domain?page=1`);
      } else {
        console.log(data.callType);
        res.send('success');
      }
    } else {
      throw new ForbiddenException();
    }
  }

  @ApiOperation({ summary: '도메인 변경' })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Patch('domain/:id')
  async updateDomain(
    @UserDecorator() user: User,
    @Body() data: UpdateDomainDto,
    @Param('id') id: number,
    @Res() res,
  ) {
    const result = this.licenseService.updateDomain(user.id, id, data);
    if (result) {
      let searchType = '';
      let searchValue = '';

      if (data.searchType) searchType = `&searchType=${data.searchType}`;
      if (data.searchValue) searchValue = `&searchValue=${data.searchValue}`;

      res.redirect(
        HttpStatus.SEE_OTHER,
        `/api/license/domain?page=${data.page}${searchType}${searchValue}`,
      );
    } else {
      throw new ForbiddenException();
    }
  }

  @ApiExcludeEndpoint()
  @ApiOperation({ summary: '도메인 삭제' })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Post('deleteDomain')
  async deleteDomain(
    @UserDecorator() user: User,
    @Body() data: DeleteDomainDto,
    @Query() query: GetTableDto,
    @Res() res,
  ) {
    // const result = await this.licenseService.deleteDomain(user.id, data.domainIds);
    // if (result) {
    //   res.redirect(
    //     HttpStatus.SEE_OTHER,
    //     `/api/license/domain?page=${query.page}&searchType=${query.searchType}&searchValue=${query.searchValue}`,
    //   );
    // } else {
    //   throw new ForbiddenException();
    // }
  }

  @ApiExcludeEndpoint()
  @Get('test')
  async test() {
    return await this.licenseService.test();
  }

  @ApiExcludeEndpoint()
  @Get('coupon')
  async coupon() {
    return this.licenseService.coupon();
  }
}

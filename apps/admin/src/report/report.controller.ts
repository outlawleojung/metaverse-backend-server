import { LoggedInGuard } from './../auth/logged-in.guard';
import {
  Controller,
  UseInterceptors,
  Logger,
  UseGuards,
  Get,
  HttpStatus,
  Query,
  Param,
  Patch,
  Body,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MorganInterceptor } from 'nest-morgan';
import { ReportService } from './report.service';
import { AdminDecorator } from '../common/decorators/admin.decorator';
import { Admin } from '@libs/entity';
import { GetReportListDto } from './dto/req/get.report.list.dto';
import { GetConstantsDto } from './dto/res/get.constants.dto';
import { GetDetailResponseDto } from './dto/res/get.detail.response.dto';
import { GetReportListResponseDto } from './dto/res/get.report.response.dto';
import { PatchReportDto } from './dto/req/patch.report.dto';
import { ROLE_TYPE } from '@libs/constants';
import { Roles } from '../common/decorators/roles.decorator';
import { GetDisciplineReviewResponseDto } from './dto/res/get.disciplineReveiw.response.dto';

@ApiTags('REPORT - 신고하기')
@UseInterceptors(MorganInterceptor('combined'))
@Controller('api/report')
export class ReportController {
  constructor(private reportService: ReportService) {}
  private readonly logger = new Logger(ReportService.name);

  @ApiOperation({ summary: '신고 타입 상수 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetConstantsDto,
  })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Get('constant')
  async getConstant() {
    return await this.reportService.getConstant();
  }

  @ApiOperation({ summary: '신고 제재 선택 목록' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetDisciplineReviewResponseDto,
  })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Get('disciplineList')
  async getDisciplineList() {
    return await this.reportService.getDisciplineList();
  }

  @ApiOperation({ summary: '신고 내역 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetReportListResponseDto,
  })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Get()
  async getReports(
    @AdminDecorator() admin: Admin,
    @Query() data: GetReportListDto,
  ) {
    return await this.reportService.getReports(
      admin.id,
      data.page,
      data.searchType,
      data.searchValue,
      data.searchDateTime,
      data.reportType,
      data.reasonType,
      data.stateType,
    );
  }

  @ApiOperation({ summary: '신고 상세 내역 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetDetailResponseDto,
  })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Get(':reportId')
  async getReport(
    @AdminDecorator() admin: Admin,
    @Param('reportId') reportId: number,
  ) {
    return await this.reportService.getReport(admin.id, reportId);
  }

  @ApiOperation({ summary: '신고 처리 하기' })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Patch()
  async patchReport(
    @AdminDecorator() admin: Admin,
    @Body() data: PatchReportDto,
    @Param('reportId') reportId: number,
  ) {
    return await this.reportService.patchReport(admin.id, reportId, data);
  }
}

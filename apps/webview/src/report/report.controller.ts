import { UseInterceptors } from '@nestjs/common/decorators';
import {
  Controller,
  Post,
  UseGuards,
  UploadedFiles,
  Body,
  Get,
  HttpStatus,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { MorganInterceptor } from 'nest-morgan';
import { ReportService } from './report.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { LoggedInGuard } from '../auth/logged.in.guard';
import { MemberDecorator } from '../common/decorators/member.decorator';
import { CreateReportDto } from './dto/create.report.dto';
import { GetConstantResponseDto } from './dto/get.constant.response.dto';

@ApiTags('REPORT - 신고하기')
@UseInterceptors(MorganInterceptor('combined'))
@Controller('api/report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  // 신고하기
  @ApiOperation({ summary: '신고 하기' })
  @Post()
  @UseInterceptors(FilesInterceptor('image'))
  @UseGuards(LoggedInGuard)
  async createReport(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @MemberDecorator() member,
    @Body() data: CreateReportDto,
  ) {
    return await this.reportService.createReport(
      files,
      member.id,
      member.nickname,
      data,
    );
  }

  @ApiOperation({ summary: '신고 관련 상수 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetConstantResponseDto,
  })
  @UseGuards(LoggedInGuard)
  @Get('constant')
  async getConstant() {
    return await this.reportService.getConstant();
  }
}

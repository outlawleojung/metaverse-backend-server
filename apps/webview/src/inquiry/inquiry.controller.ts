import { UseInterceptors } from '@nestjs/common/decorators';
import {
  Controller,
  Post,
  UseGuards,
  Get,
  Param,
  Delete,
  UploadedFiles,
  Body,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { MorganInterceptor } from 'nest-morgan';
import { InquiryService } from './inquiry.service';
import { LoggedInGuard } from '../auth/logged.in.guard';
import { MemberDecorator } from '../common/decorators/member.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateInquiryDto } from './dto/req/create.inquiry.dto';
import { MoreInquiryDto } from './dto/req/more.inquiry.dto';
import { GetMyInquiryResponseDto } from './dto/res/get.my.inquiry.response.dto';

@ApiTags('INQUIRY - 문의하기')
@UseInterceptors(MorganInterceptor('combined'))
@Controller('api/inquiry')
export class InquiryController {
  constructor(private readonly inquiryService: InquiryService) {}

  @ApiOperation({ summary: '문의 타입 상수 조회' })
  @UseGuards(LoggedInGuard)
  @Get('constant')
  async getConstant() {
    return await this.inquiryService.getConstant();
  }

  // 문의 내역 목록 조회
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetMyInquiryResponseDto,
    isArray: true,
  })
  @ApiOperation({ summary: '문의 내역 목록 조회' })
  @UseGuards(LoggedInGuard)
  @Get()
  async getInquiries(
    @MemberDecorator() member,
    @Query('lastId') lastId: number,
  ) {
    return await this.inquiryService.getInquiries(member.memberId, lastId);
  }

  // 문의 내역 조회
  @ApiOperation({ summary: '문의 내역 조회' })
  @UseGuards(LoggedInGuard)
  @Get('/:groupId')
  async getInquiry(
    @MemberDecorator() member,
    @Param('groupId') groupId: number,
    @Query('lastId') lastId: number,
  ) {
    return await this.inquiryService.getInquiry(
      member.memberId,
      groupId,
      lastId,
    );
  }

  // 문의 하기
  @ApiOperation({ summary: '문의 하기' })
  @UseInterceptors(FilesInterceptor('image'))
  @UseGuards(LoggedInGuard)
  @Post()
  async inquiry(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @MemberDecorator() member,
    @Body() data: CreateInquiryDto,
  ) {
    return await this.inquiryService.inquiry(files, member.memberId, data);
  }

  // 추가 문의 하기
  @ApiOperation({ summary: '추가 문의 하기' })
  @UseInterceptors(FilesInterceptor('image'))
  @UseGuards(LoggedInGuard)
  @Post('more')
  async moreInquiry(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @MemberDecorator() member,
    @Body() data: MoreInquiryDto,
  ) {
    return await this.inquiryService.moreInquiry(files, member.memberId, data);
  }

  // 문의 삭제
  @ApiOperation({ summary: '문의 삭제' })
  @UseGuards(LoggedInGuard)
  @Delete(':groupId')
  async deleteInquiry(
    @MemberDecorator() member,
    @Param('groupId') groupId: number,
  ) {
    return await this.inquiryService.deleteInquiry(member.memberId, groupId);
  }
}

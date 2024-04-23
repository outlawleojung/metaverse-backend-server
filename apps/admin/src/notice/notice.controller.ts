import { Roles } from './../common/decorators/roles.decorator';
import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { NoticeService } from './notice.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MorganInterceptor } from 'nest-morgan';
import { LoggedInGuard } from '../auth/logged-in.guard';
import { ROLE_TYPE } from '@libs/constants';
import { GetNoticesDto } from './dto/req/get.notices.dto';
import { ResponseGetNoticesDto } from './dto/res/response.get.notices.dto';
import { CreateNoticeDto } from './dto/req/create.notice.dto';
import { AdminDecorator } from '../common/decorators/admin.decorator';
import { UpdateNoticeDto } from './dto/req/update.notice.dto';

@ApiTags('NOTICE - 공지사항')
@UseInterceptors(MorganInterceptor('combined'))
@Controller('api/notice')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @ApiOperation({ summary: '공지 사항 상수 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResponseGetNoticesDto,
  })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.SUPER_ADMIN)
  @Get('constants')
  async getConstants() {
    return this.noticeService.getConstants();
  }

  @ApiOperation({ summary: '공지 사항 목록 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResponseGetNoticesDto,
  })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.SUPER_ADMIN)
  @Get()
  async getNotices(@Query() data: GetNoticesDto) {
    return this.noticeService.getNotices(data);
  }

  @ApiOperation({ summary: '공지 사항 상세 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResponseGetNoticesDto,
  })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.SUPER_ADMIN)
  @Get(':id')
  async getNotice(@Param('id') id: number) {
    return this.noticeService.getNotice(id);
  }

  @ApiOperation({ summary: '공지 사항 등록' })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.SUPER_ADMIN)
  @Post()
  async createNotice(
    @AdminDecorator() admin,
    @Body() data: CreateNoticeDto,
    @Res() res,
  ) {
    const result = await this.noticeService.createNotice(admin.id, data);

    if (result) {
      res.redirect(HttpStatus.SEE_OTHER, `/api/notice?page=1`);
    } else {
      throw new ForbiddenException('DB 실패!!');
    }
  }

  @ApiOperation({ summary: '공지 사항 편집' })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.SUPER_ADMIN)
  @Patch(':id')
  async updateNotice(
    @AdminDecorator() admin,
    @Param('id') noticeId: number,
    @Body() data: UpdateNoticeDto,
    @Query() query: GetNoticesDto,
    @Res() res,
  ) {
    const result = await this.noticeService.updateNotice(
      admin.id,
      noticeId,
      data,
    );

    if (result) {
      let path = `/api/notice?`;
      const page = query.page ?? 1;
      path += `page=${page}`;

      if (query.noticeType) {
        path += `&noticeType=${query.noticeType}`;
      }

      res.redirect(HttpStatus.SEE_OTHER, path);
    } else {
      throw new ForbiddenException('DB 실패!!');
    }
  }

  @ApiOperation({ summary: '공지 사항 삭제' })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.SUPER_ADMIN)
  @Delete(':id')
  async deleteNotice(@AdminDecorator() admin, @Param('id') noticeId: number) {
    return await this.noticeService.deleteNotice(noticeId);
  }
}

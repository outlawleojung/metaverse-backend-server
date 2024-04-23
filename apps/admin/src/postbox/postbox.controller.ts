import { GetTableDto } from './../common/dto/get.table.dto';
import { LoggedInGuard } from '../auth/logged-in.guard';
import {
  Controller,
  Get,
  HttpStatus,
  Logger,
  Query,
  UseGuards,
  UseInterceptors,
  Post,
  Body,
  Res,
  ForbiddenException,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MorganInterceptor } from 'nest-morgan';
import { PostboxService } from './postbox.service';
import { GetConstantsResponseDto } from './dto/res/get.constants.response.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { SendFullMailingDto } from './dto/req/send.full.mailing.dto';
import { AdminDecorator } from '../common/decorators/admin.decorator';
import { SendEachMailingDto } from './dto/req/send.each.mailing.dto';
import { GetItemsResponseDTO } from './dto/res/get.items.response.dto';
import { GetMemberResponseDTO } from './dto/res/get.member.response.dto';
import { GetPostboxResponseDTO } from './dto/res/get.postbox.response.dto';
import { UpdteMailingDto } from './dto/req/update.mailing.dto';
import { GetLogDto } from './dto/req/get.log.dto';
import { ROLE_TYPE } from '@libs/constants';
import { GetItemDto } from './dto/req/get.item.dto';

@ApiTags('POSTBOX - 우편함')
@UseInterceptors(MorganInterceptor('combined'))
@Controller('api/postbox')
export class PostboxController {
  constructor(private postboxService: PostboxService) {}
  private readonly logger = new Logger(PostboxController.name);

  // 우편함 상수 조회
  @ApiOperation({ summary: '우편함 상수 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    isArray: true,
    type: GetConstantsResponseDto,
  })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Get('constant')
  async getConstant() {
    return await this.postboxService.getConstants();
  }

  @ApiOperation({ summary: '우편함 아이템 목록 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetItemsResponseDTO,
  })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Get('items')
  async getPostalItems(@Query() data: GetItemDto) {
    const items = await this.postboxService.getItems(data);
    return items;
  }

  @ApiOperation({ summary: '우편함 개별 발송 회원 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetMemberResponseDTO,
  })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Get('members/:type/:value')
  async getMembers(@Param('type') type: number, @Param('value') value: string) {
    return await this.postboxService.getMembers(type, value);
  }

  // 우편 목록 조회
  @ApiOperation({ summary: '우편 목록 조회' })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Get()
  async getPostboxes(@Query() data: GetTableDto) {
    return await this.postboxService.getPostboxes(data);
  }

  // 우편 상세 조회
  @ApiOperation({ summary: '우편 상세 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetPostboxResponseDTO,
  })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Get('/:postboxId')
  async getPostbox(@Param('postboxId') postboxId: number) {
    return await this.postboxService.getPostbox(postboxId);
  }

  @ApiOperation({ summary: '우편 전체 발송' })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Post('full-mailing')
  async fullMailing(
    @AdminDecorator() admin,
    @Body() data: SendFullMailingDto,
    @Res() res,
  ) {
    const result = await this.postboxService.fullMailing(admin.id, data);
    if (result) {
      return res.redirect(HttpStatus.SEE_OTHER, `/api/postbox?page=1`);
    }
    throw new ForbiddenException('우편 발송 등록 실패');
  }

  @ApiOperation({ summary: '우편 개별 발송' })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Post('each-mailing')
  async eachMailing(
    @AdminDecorator() admin,
    @Body() data: SendEachMailingDto,
    @Res() res,
  ) {
    const result = await this.postboxService.eachMailing(admin.id, data);
    if (result) {
      return res.redirect(HttpStatus.SEE_OTHER, `/api/postbox?page=1`);
    }
    throw new ForbiddenException('우편 발송 등록 실패');
  }

  // 우편 편집
  @ApiOperation({ summary: '우편 편집' })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Patch('/:postboxId')
  async updatePostbox(
    @AdminDecorator() admin,
    @Body() data: UpdteMailingDto,
    @Param('postboxId') postboxId: number,
    @Res() res,
  ) {
    const result = await this.postboxService.updatePostbox(
      admin.id,
      data,
      postboxId,
    );
    if (result) {
      return res.redirect(
        HttpStatus.SEE_OTHER,
        `/api/postbox?page=${data.page}`,
      );
    }
    throw new ForbiddenException('우편 편집 실패');
  }

  // 우편 삭제
  @ApiOperation({ summary: '우편 삭제' })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Delete('/:postboxId')
  async deletePostbox(
    @AdminDecorator() admin,
    @Param('postboxId') postboxId: number,
    @Query('page') page: number,
    @Res() res,
  ) {
    const result = await this.postboxService.deletePostbox(
      admin.id,
      postboxId,
      page,
    );
    if (result) {
      return res.redirect(HttpStatus.SEE_OTHER, `/api/postbox?page=${page}`);
    }
    throw new ForbiddenException('우편 삭제 실패');
  }

  // 우편 보류 하기
  @ApiOperation({ summary: '우편 보류 하기' })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Patch('pending/:postboxId')
  async pendingPostbox(
    @AdminDecorator() admin,
    @Param('postboxId') postboxId: number,
  ) {
    return await this.postboxService.pendingPostbox(admin.id, postboxId);
  }

  // 우편 보류 해제 하기
  @ApiOperation({ summary: '우편 보류 해제 하기' })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Patch('release-pending/:postboxId')
  async releasePendingPostbox(
    @AdminDecorator() admin,
    @Param('postboxId') postboxId: number,
  ) {
    return await this.postboxService.releasePendingPostbox(admin.id, postboxId);
  }

  // 발송 로그 보기
  @ApiOperation({ summary: '우편 발송 로그 보기' })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Get('log/send-log')
  async getSendLogs(@Query() data: GetTableDto) {
    return await this.postboxService.getSendLogs(data);
  }

  // 수령 로그 보기
  @ApiOperation({ summary: '우편 수령 로그 보기' })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Get('log/receive-log')
  async getReceiveLogs(@Query() data: GetTableDto) {
    return await this.postboxService.getReceiveLogs(data);
  }

  // 상세 로그 보기
  @ApiOperation({ summary: '상세 로그 보기' })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Get('log/detail-log/:postboxId')
  async getDetailLogs(
    @Param('postboxId') postboxId: number,
    @Query() data: GetLogDto,
  ) {
    return await this.postboxService.getDetailLogs(data, postboxId);
  }
}

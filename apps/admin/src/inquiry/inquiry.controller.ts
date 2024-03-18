import { ROLE_TYPE } from '@libs/constants';
import { ForbiddenException } from '@nestjs/common/exceptions';
import { UpdateInquiryTemplateDto } from './dto/req/update.inquiry.template.dto';
import { CreateAnswerDto } from './dto/req/create.answer.dto';
import { UseInterceptors } from '@nestjs/common/decorators';
import {
  Controller,
  Res,
  Logger,
  Post,
  UseGuards,
  Body,
  Get,
  Query,
  HttpStatus,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MorganInterceptor } from 'nest-morgan';
import { InquiryService } from './inquiry.service';
import { LoggedInGuard } from '../auth/logged-in.guard';
import { UserDecorator } from '../common/decorators/user.decorator';
import { User } from '@libs/entity';
import { CreateInquiryTemplateDto } from './dto/req/create.inquiry.template.dto';
import { GetInquiryTemplateDto } from './dto/res/get.inquiry.templete.dto';
import { GetConstantsDto } from './dto/res/get.constants.dto';
import { GetInquiryListDto } from './dto/req/get.inquiry.list.dto';
import { UpdateAnswerDto } from './dto/req/update.answer.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { GetTableDto } from '../common/dto/get.table.dto';

@ApiTags('INQUIRY - 문의하기')
@UseInterceptors(MorganInterceptor('combined'))
@Controller('api/inquiry')
export class InquiryController {
  constructor(private inquiryService: InquiryService) {}
  private readonly logger = new Logger(InquiryController.name);

  @ApiOperation({ summary: '문의 타입 상수 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetConstantsDto,
  })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Get('constant')
  async getConstant() {
    return await this.inquiryService.getConstant();
  }

  @ApiOperation({ summary: '문의 내역 조회' })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Get()
  async getInquiries(@Query() data: GetInquiryListDto) {
    return await this.inquiryService.getInquiries(data);
  }

  @ApiOperation({ summary: '문의 내역 상세 조회' })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Get('detail/:groupId')
  async getInquiry(
    @UserDecorator() user: User,
    @Param('groupId') groupId: number,
  ) {
    return await this.inquiryService.getInquiry(user.id, groupId);
  }

  @ApiOperation({ summary: '문의 내역 상세 조회 (문의 조회 만)' })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Get('detail/parts/:groupId')
  async getInquiryParts(
    @UserDecorator() user: User,
    @Param('groupId') groupId: number,
  ) {
    return await this.inquiryService.getInquiryParts(user.id, groupId);
  }

  @ApiOperation({ summary: '문의 내역 상세 조회 (로그 만)' })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Get('detail/log/:groupId')
  async getInquiryLog(
    @UserDecorator() user: User,
    @Param('groupId') groupId: number,
  ) {
    return await this.inquiryService.getInquiryLog(user.id, groupId);
  }

  @ApiOperation({ summary: '답변 하기' })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Post('answer')
  async inquiryAnswer(
    @UserDecorator() user: User,
    @Body() data: CreateAnswerDto,
  ) {
    return await this.inquiryService.answer(user.id, data);
  }

  @ApiOperation({ summary: '답변 수정' })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Patch('answer/:inquiryId')
  async editInquiryAnswer(
    @UserDecorator() user: User,
    @Param('inquiryId') inquiryId: number,
    @Body() data: UpdateAnswerDto,
  ) {
    return await this.inquiryService.editInquiryAnswer(
      user.id,
      inquiryId,
      data,
    );
  }

  @ApiOperation({ summary: '답변 템플릿 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetInquiryTemplateDto,
  })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Get('template')
  async getTemplate(@UserDecorator() user: User, @Query() data: GetTableDto) {
    return await this.inquiryService.getTemplate(user.id, data);
  }

  @ApiOperation({ summary: '답변 템플릿 생성' })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Post('template')
  async createTemplate(
    @UserDecorator() user: User,
    @Body() data: CreateInquiryTemplateDto,
    @Res() res,
  ) {
    const result = await this.inquiryService.createTemplate(user.id, data);
    if (result) {
      return res.redirect(HttpStatus.SEE_OTHER, `/api/inquiry/template?page=1`);
    }

    throw new ForbiddenException('db 에러');
  }

  @ApiOperation({ summary: '답변 템플릿 수정' })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Patch('template/:templateId/:page')
  async updateTemplate(
    @UserDecorator() user: User,
    @Body() data: UpdateInquiryTemplateDto,
    @Param('templateId') templateId: number,
    @Param('page') page: number,
    @Res() res,
  ) {
    const result = await this.inquiryService.updateTemplate(
      user.id,
      templateId,
      data,
    );
    if (result) {
      return res.redirect(
        HttpStatus.SEE_OTHER,
        `/api/inquiry/template?page=${page}`,
      );
    }

    throw new ForbiddenException('db 에러');
  }

  @ApiOperation({ summary: '답변 템플릿 삭제' })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Delete('template/:templateId/:page')
  async delteTemplate(
    @UserDecorator() user: User,
    @Param('templateId') templateId: number,
    @Param('page') page: number,
    @Res() res,
  ) {
    const result = await this.inquiryService.deleteTemplate(
      user.id,
      templateId,
    );
    if (result) {
      return res.redirect(
        HttpStatus.SEE_OTHER,
        `/api/inquiry/template?page=${page}`,
      );
    }

    throw new ForbiddenException('db 에러');
  }
}

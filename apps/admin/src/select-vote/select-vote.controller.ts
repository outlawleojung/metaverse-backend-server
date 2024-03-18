import {
  Controller,
  UseInterceptors,
  Logger,
  HttpStatus,
  UseGuards,
  Get,
  Param,
  Patch,
  Delete,
  Query,
  Post,
  Body,
  UploadedFile,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MorganInterceptor } from 'nest-morgan';
import { SelectVoteService } from './select-vote.service';
import { Roles } from '../common/decorators/roles.decorator';
import { LoggedInGuard } from '../auth/logged-in.guard';
import { UserDecorator } from '../common/decorators/user.decorator';
import { User } from '@libs/entity';
import { GetTableDto } from '../common/dto/get.table.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateSelectVoteDto } from './dto/req/create.select.vote.dto';
import { UpdateSelectVoteDto } from './dto/req/update.select.vote.dto';
import { GetSelectVoteResultDto } from './dto/res/get.select.vote.result.dto';
import { GetMemberSelectVoteInfoDto } from './dto/res/get.member.select.vote.info.dto';
import { CreateSelectVoteItemDto } from './dto/req/create.select.vote.item.dto';
import { UpdateSelectVoteItemDto } from './dto/req/update.select.vote.item.dto';
import { GetSelelctVoteItemDetailDto } from './dto/res/get.select.vote.item.detail.dto';
import { GetSelelctVoteDetailDto } from './dto/res/get.select.vote.detail.dto';
import { GetSelectVoteListDto } from './dto/res/get.select.vote.list.dto';
import { UpdateSelectVoteItemListDto } from './dto/req/update.select.vote.item.list.dto';
import { GetMemberSelectVoteExcelDto } from './dto/res/get.member.select.vote.excel.dto';
import { ROLE_TYPE } from '@libs/constants';

@ApiTags('SELECT VOTE - 선택 투표')
@UseInterceptors(MorganInterceptor('combined'))
@Controller('api/select-vote')
export class SelectVoteController {
  private readonly logger = new Logger(SelectVoteController.name);
  constructor(private selectVoteService: SelectVoteService) {}

  //투표 상수 조회
  @ApiOperation({ summary: '투표 상수 조회' })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Get('constants')
  async getVoteConstants() {
    return await this.selectVoteService.getVoteConstants();
  }

  //투표 리스트 조회

  @ApiResponse({
    status: HttpStatus.OK,
    type: GetSelectVoteListDto,
    isArray: true,
  })
  @ApiOperation({ summary: '선택 투표 리스트 조회' })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Get()
  async getVoteList(@Query() data: GetTableDto) {
    return await this.selectVoteService.getVoteList(data);
  }

  //투표 상세 조회
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetSelelctVoteDetailDto,
  })
  @ApiOperation({ summary: '선택 투표 상세 조회' })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Get('detail/:voteId')
  async getVote(@Param('voteId') voteId: number) {
    return await this.selectVoteService.getVote(voteId);
  }

  //투표 추가
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiOperation({ summary: '선택 투표 추가' })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Post()
  async createSelectVote(
    @UserDecorator() user: User,
    @Body() data: CreateSelectVoteDto,
  ) {
    return await this.selectVoteService.createSelectVote(user.id, data);
  }

  //투표 편집
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiOperation({ summary: '선택 투표 편집' })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Patch(':voteId')
  async updateSelectVote(
    @UserDecorator() user: User,
    @Body() data: UpdateSelectVoteDto,
    @Param('voteId') voteId: number,
  ) {
    return await this.selectVoteService.updateSelectVote(user.id, voteId, data);
  }

  // 투표 항목 상세 조회
  @ApiOperation({ summary: '선택 투표 항목 상세 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetSelelctVoteItemDetailDto,
    isArray: true,
  })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Get('item-detail/:voteId')
  async getDetailItem(@Param('voteId') voteId: number) {
    return await this.selectVoteService.getDetailItem(voteId);
  }

  // 투표 항목 생성
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiOperation({ summary: '선택 투표 항목 추가' })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  @Post('create-item/:voteId')
  async createSelectVoteItem(
    @UploadedFile() file: Express.Multer.File,
    @UserDecorator() user: User,
    @Body() data: CreateSelectVoteItemDto,
    @Param('voteId') voteId: number,
  ) {
    return await this.selectVoteService.createSelectVoteItem(
      user.id,
      voteId,
      data,
      file,
    );
  }

  // 투표 항목 편집
  @ApiOperation({ summary: '선택 투표 항목 편집' })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  @Patch('update-item/:voteId')
  async updateSelectVoteItem(
    @UploadedFile() file: Express.Multer.File,
    @UserDecorator() user: User,
    @Param('voteId') voteId: number,
    @Body() data: UpdateSelectVoteItemDto,
  ) {
    return await this.selectVoteService.updateSelectVoteItem(
      user.id,
      voteId,
      data,
      file,
    );
  }

  // 투표 항목 노출 순서 편집
  @ApiOperation({ summary: '선택 투표 항목 리스트 편집' })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Patch('update-item-list/:voteId')
  async updateVoteItemList(
    @UserDecorator() user: User,
    @Param('voteId') voteId: number,
    @Body() data: UpdateSelectVoteItemListDto,
  ) {
    return await this.selectVoteService.updateVoteItemList(
      user.id,
      voteId,
      data,
    );
  }

  // 투표 삭제
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetSelectVoteResultDto,
  })
  @ApiOperation({ summary: '선택 투표 삭제' })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Delete(':voteId')
  async deleteSelectVote(
    @UserDecorator() user: User,
    @Param('voteId') voteId: number,
  ) {
    return await this.selectVoteService.deleteSelectVote(voteId);
  }

  // 투표 결과
  @ApiOperation({ summary: '선택 투표 결과' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetSelectVoteResultDto,
  })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Get('/result/:voteId')
  async getResult(@Param('voteId') voteId) {
    return await this.selectVoteService.getResult(voteId);
  }

  // 회원 투표 리스트
  @ApiOperation({ summary: '회원 선택 투표 리스트' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetMemberSelectVoteInfoDto,
    isArray: true,
  })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Get('/member-vote-list/:voteId')
  async getMemberVoteList(@Param('voteId') voteId, @Query() data: GetTableDto) {
    console.log('searchType : ', data.searchType);
    console.log('searchValue : ', data.searchValue);
    return await this.selectVoteService.getMemberVoteList(voteId, data);
  }

  // 선택 투표 Excel 용 리스트
  @ApiOperation({ summary: '회원 선택 투표 Excel 리스트' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetMemberSelectVoteExcelDto,
    isArray: true,
  })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Get('/member-vote-excel-list/:voteId')
  async getMemberVoteExcelList(@Param('voteId') voteId) {
    return await this.selectVoteService.getMemberVoteExcelList(voteId);
  }
}

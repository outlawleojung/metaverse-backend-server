import {
  Post,
  Get,
  Patch,
  Param,
  Delete,
  Controller,
  Query,
  UseInterceptors,
  Headers,
  Body,
  UseGuards,
  HttpStatus,
  UploadedFile,
  ForbiddenException,
  Res,
  Logger,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { AzureBlobService } from '@libs/common';
import { AdminDecorator } from '../common/decorators/admin.decorator';
import { Admin } from '@libs/entity';
import { VoteService } from './vote.service';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { ErrorDto } from './dto/res/error.response.dto';
import { GetVoteListResponseDto } from './dto/res/get.vote.list.response.dto';
import { AddVoteRegisterDto } from './dto/req/add.vote.dto';
import { AddVoteResponseDto } from './dto/res/add.vote.response.dto';
import { DeleteVoteInfoResponseDto } from './dto/res/delete.vote.info.response';
import { UpdateVoteInfoDto } from './dto/req/update.vote.info.dto';
import { GetVoteResultInfoResultDto } from './dto/res/get.vote.result.response.dto';
import { GetVoteResultListInfoDto } from './dto/req/get.vote.result.list.info.dto';
import { MorganInterceptor } from 'nest-morgan';
import { LoggedInGuard } from '../auth/logged-in.guard';
import { GetTableDto } from '../common/dto/get.table.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { ROLE_TYPE } from '@libs/constants';

@ApiTags('VOTE - 투표')
@UseInterceptors(MorganInterceptor('combined'))
@Controller('api/vote')
export class VoteController {
  private readonly logger = new Logger(VoteController.name);
  constructor(
    private azureBlobService: AzureBlobService,
    private voteService: VoteService,
  ) {}

  //투표 리스트 조회
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: ErrorDto,
    description: 'Error',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetVoteListResponseDto,
  })
  @ApiOperation({ summary: '투표 리스트 조회' })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Get()
  async getVoteList(
    @AdminDecorator() admin: Admin,
    @Query() data: GetTableDto,
  ) {
    return await this.voteService.getVoteList(admin.id, data);
  }

  //투표 추가
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: ErrorDto,
    description: 'Error',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: AddVoteResponseDto,
  })
  @ApiOperation({ summary: '투표 추가' })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  async postVoteRegister(
    @UploadedFile() file: Express.Multer.File,
    @AdminDecorator() admin: Admin,
    @Body() data: AddVoteRegisterDto,
    @Res() res,
  ) {
    //로거

    // logger file.buffer을 제외한 나머지 정보를 출력
    const { buffer, ...fileWithoutBuffer } = file;
    this.logger.log(fileWithoutBuffer);

    const result = await this.voteService.postVoteRegister(
      admin.id,
      file,
      data,
    );
    if (result) {
      res.redirect(HttpStatus.MOVED_PERMANENTLY, `/api/vote?page=1`);
    } else {
      throw new ForbiddenException();
    }
  }

  //투표 날짜 정보 조회
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: ErrorDto,
    description: 'Error',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetVoteListResponseDto,
  })
  @ApiOperation({ summary: '투표 날짜 정보 조회' })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Get('dateInfo')
  async getVoteDateInfo() {
    return await this.voteService.getVoteDateInfo();
  }

  //투표 삭제
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: ErrorDto,
    description: 'Error',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: DeleteVoteInfoResponseDto,
  })
  @ApiOperation({ summary: '투표 삭제' })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Delete('/:voteId/:page')
  async deleteVoteInfo(
    @AdminDecorator() admin: Admin,
    @Param() param,
    @Res() res,
  ) {
    const result = await this.voteService.deleteVoteInfo(
      admin.id,
      param.voteId,
      param.page,
    );
    if (result) {
      res.method = 'GET';
      res.redirect(HttpStatus.SEE_OTHER, `/api/vote?page=${param.page}`);
    } else {
      throw new ForbiddenException();
    }
  }

  // 투표 수정
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: ErrorDto,
    description: 'Error',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ErrorDto,
  })
  @ApiOperation({ summary: '투표 수정' })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @UseInterceptors(FileInterceptor('image'))
  @Patch('/:voteId')
  async patchVoteInfo(
    @UploadedFile() file: Express.Multer.File,
    @AdminDecorator() admin: Admin,
    @Body() data: UpdateVoteInfoDto,
    @Param('voteId') voteId: number,
    @Res() res,
  ) {
    const result = await this.voteService.patchVoteInfo(
      file,
      admin.id,
      voteId,
      data,
    );
    if (result) {
      res.method = 'GET';
      res.redirect(HttpStatus.SEE_OTHER, `/api/vote?page=${data.page}`);
    } else {
      throw new ForbiddenException();
    }
  }

  //투표 상수 조회
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: ErrorDto,
    description: 'Error',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetVoteListResponseDto,
  })
  @ApiOperation({ summary: '투표 상수 조회' })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Get('constants')
  async getVoteConstants() {
    return await this.voteService.getVoteConstants();
  }

  //투표 결과 정보 조회
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: ErrorDto,
    description: 'Error',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetVoteResultInfoResultDto,
  })
  @ApiOperation({ summary: '투표 결과 정보 조회' })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Get('/resultInfo/:voteId')
  async getVoteResultInfo(@Param('voteId') voteId: number) {
    return await this.voteService.getVoteResultInfo(voteId);
  }

  //투표 결과 리스트 조회
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    type: ErrorDto,
    description: 'Error',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetVoteResultInfoResultDto,
  })
  @ApiOperation({ summary: '투표 결과 리스트 정보 조회' })
  @UseGuards(LoggedInGuard)
  @Roles(ROLE_TYPE.MIDDLE_ADMIN)
  @Get('/resultList/:voteId')
  async getVoteResultListInfo(
    @Param('voteId') voteId: number,
    @Query() data: GetVoteResultListInfoDto,
  ) {
    return await this.voteService.getVoteResultListInfo(voteId, data);
  }
}

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MorganInterceptor } from 'nest-morgan';
import { SelectVoteService } from './select-vote.service';
import { JwtGuard } from '@libs/common';
import { GetCommonDto } from '../dto/get.common.dto';
import { GetSelectVoteInfoResponseDto } from './dto/res/get.select.vote.info.dto';
import { DoVoteDto } from './dto/req/do.vote.dto';
import { GetSelectVoteResultResponseDto } from './dto/res/get.select.vote.result.dto';
import { DoVoteInfoResponseDto } from './dto/res/do.vote.response.dto';
import { DoLikeInfoResponseDto } from './dto/res/do.like.response.dto';

@UseInterceptors(MorganInterceptor('combined'))
@ApiTags('SELECT VOTE - 선택 투표')
@Controller('api/select-vote')
export class SelectVoteController {
  constructor(private readonly selectVoteService: SelectVoteService) {}

  // 투표 목록 조회
  @ApiOperation({ summary: '선택 투표 목록 조회' })
  @ApiResponse({
    type: GetSelectVoteInfoResponseDto,
  })
  @UseGuards(JwtGuard)
  @Get()
  async getSelectVote(@Body() data: GetCommonDto) {
    return await this.selectVoteService.getSelectVote(data);
  }

  // 투표 하기
  @ApiOperation({ summary: '선택 투표 하기' })
  @ApiResponse({
    type: DoVoteInfoResponseDto,
  })
  @UseGuards(JwtGuard)
  @Post()
  async doVote(@Body() data: DoVoteDto) {
    return await this.selectVoteService.doVote(data);
  }

  // 좋아요
  @ApiOperation({ summary: '좋아요' })
  @ApiResponse({
    type: DoLikeInfoResponseDto,
  })
  @UseGuards(JwtGuard)
  @Post('like')
  async doLike(@Body() data: DoVoteDto) {
    return await this.selectVoteService.doLike(data);
  }

  // 투표 결과
  @ApiOperation({ summary: '선택 투표 결과 조회' })
  @ApiResponse({
    type: GetSelectVoteResultResponseDto,
  })
  @UseGuards(JwtGuard)
  @Get('result/:voteId')
  async getResult(@Body() data: GetCommonDto, @Param('voteId') voteId: number) {
    return await this.selectVoteService.getVoteResult(data.memberId, voteId);
  }

  // KTMF 이벤트 메일 확인
  @ApiOperation({ summary: 'KTMF 이벤트 메일 확인' })
  @Get('ktmf-email')
  @UseGuards(JwtGuard)
  async getKtmfEmail(@Body() data: GetCommonDto) {
    return await this.selectVoteService.getKtmfEmail(data.memberId);
  }
}

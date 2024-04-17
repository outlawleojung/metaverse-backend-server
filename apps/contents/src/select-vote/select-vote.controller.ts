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
import { GetSelectVoteInfoResponseDto } from './dto/res/get.select.vote.info.dto';
import { DoVoteDto } from './dto/req/do.vote.dto';
import { GetSelectVoteResultResponseDto } from './dto/res/get.select.vote.result.dto';
import { DoVoteInfoResponseDto } from './dto/res/do.vote.response.dto';
import { DoLikeInfoResponseDto } from './dto/res/do.like.response.dto';
import { AccessTokenGuard, MemberDeco, MemberDto } from '@libs/common';

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
  @UseGuards(AccessTokenGuard)
  @Get()
  async getSelectVote(@MemberDeco() member: MemberDto) {
    return await this.selectVoteService.getSelectVote(member.memberId);
  }

  // 투표 하기
  @ApiOperation({ summary: '선택 투표 하기' })
  @ApiResponse({
    type: DoVoteInfoResponseDto,
  })
  @UseGuards(AccessTokenGuard)
  @Post()
  async doVote(@MemberDeco() member: MemberDto, @Body() data: DoVoteDto) {
    return await this.selectVoteService.doVote(member.memberId, data);
  }

  // 좋아요
  @ApiOperation({ summary: '좋아요' })
  @ApiResponse({
    type: DoLikeInfoResponseDto,
  })
  @UseGuards(AccessTokenGuard)
  @Post('like')
  async doLike(@MemberDeco() member: MemberDto, @Body() data: DoVoteDto) {
    return await this.selectVoteService.doLike(member.memberId, data);
  }

  // 투표 결과
  @ApiOperation({ summary: '선택 투표 결과 조회' })
  @ApiResponse({
    type: GetSelectVoteResultResponseDto,
  })
  @UseGuards(AccessTokenGuard)
  @Get('result/:voteId')
  async getResult(
    @MemberDeco() member: MemberDto,
    @Param('voteId') voteId: number,
  ) {
    return await this.selectVoteService.getVoteResult(member.memberId, voteId);
  }

  // KTMF 이벤트 메일 확인
  @ApiOperation({ summary: 'KTMF 이벤트 메일 확인' })
  @Get('ktmf-email')
  @UseGuards(AccessTokenGuard)
  async getKtmfEmail(@MemberDeco() member: MemberDto) {
    return await this.selectVoteService.getKtmfEmail(member.memberId);
  }
}

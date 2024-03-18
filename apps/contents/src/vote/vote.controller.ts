import { GetVoteInfoResponseDto } from './dto/response/get.vote.info.response.dto';
import { GetCommonDto } from '../dto/get.common.dto';
import {
  Controller,
  UseInterceptors,
  UseGuards,
  Post,
  Body,
  Get,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { MorganInterceptor } from 'nest-morgan';
import { VoteService } from './vote.service';
import { JwtGuard } from '@libs/common';
import { DoVoteDto } from './dto/request/do.vote.dto';

@UseInterceptors(MorganInterceptor('combined'))
@ApiTags('VOTE - 투표')
@Controller('api/vote')
export class VoteController {
  constructor(private readonly voteService: VoteService) {}

  // 투표 목록 조회
  @ApiOperation({ summary: '투표 목록 조회' })
  @ApiResponse({
    type: GetVoteInfoResponseDto,
  })
  @UseGuards(JwtGuard)
  @Get()
  async getVotes(@Body() request: GetCommonDto) {
    return await this.voteService.getVotes(request);
  }

  // 투표 하기
  @ApiOperation({ summary: '투표 하기' })
  @UseGuards(JwtGuard)
  @Post()
  async doVote(@Body() request: DoVoteDto) {
    return await this.voteService.DoVote(request);
  }
}

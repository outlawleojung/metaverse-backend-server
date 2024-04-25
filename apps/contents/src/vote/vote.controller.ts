import { GetVoteInfoResponseDto } from './dto/response/get.vote.info.response.dto';
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
import { DoVoteDto } from './dto/request/do.vote.dto';
import { AccessTokenGuard, MemberDeco, MemberDto } from '@libs/common';

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
  @UseGuards(AccessTokenGuard)
  @Get()
  async getVotes(@MemberDeco() member: MemberDto) {
    return await this.voteService.getVotes(member.id);
  }

  // 투표 하기
  @ApiOperation({ summary: '투표 하기' })
  @UseGuards(AccessTokenGuard)
  @Post()
  async doVote(@MemberDeco() member: MemberDto, @Body() data: DoVoteDto) {
    return await this.voteService.DoVote(member.id, data);
  }
}

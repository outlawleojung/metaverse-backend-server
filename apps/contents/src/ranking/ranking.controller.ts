import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MorganInterceptor } from 'nest-morgan';
import { RankingService } from './ranking.service';
import { GetAllMyRankingResponseDto } from './dto/get.all.my.ranking.response.dto';
import { GetAllRankingResponseDto } from './dto/get.all.ranking.response.dto';
import { CreateRankingDto } from './dto/create.ranking.dto';
import { AccessTokenGuard, MemberDeco, MemberDto } from '@libs/common';

@UseInterceptors(MorganInterceptor('combined'))
@ApiTags('RANKING - 랭킹')
@Controller('api/ranking')
export class RankingController {
  constructor(private readonly rankingService: RankingService) {}

  @ApiOperation({ summary: '랭킹 기록, 전체 랭킹 / 나의 기록 모두 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetAllMyRankingResponseDto,
  })
  @UseGuards(AccessTokenGuard)
  @Post()
  async createRanking(
    @MemberDeco() member: MemberDto,
    @Body() data: CreateRankingDto,
  ) {
    return await this.rankingService.crreateRanking(member.memberId, data);
  }

  @ApiOperation({ summary: '전체 랭킹, 나의 기록 모두 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetAllMyRankingResponseDto,
  })
  @UseGuards(AccessTokenGuard)
  @Get('allMyRanking')
  async getAllMyRanking(@MemberDeco() member: MemberDto) {
    return await this.rankingService.getAllMyRanking(member.memberId);
  }

  @ApiOperation({ summary: '전체 랭킹만 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetAllRankingResponseDto,
  })
  @UseGuards(AccessTokenGuard)
  @Get('allRanking')
  async getAllRanking() {
    return await this.rankingService.getAllRanking();
  }

  @ApiOperation({ summary: '나의 랭킹만 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetAllMyRankingResponseDto,
  })
  @UseGuards(AccessTokenGuard)
  @Get('myRanking')
  async getMyRanking(@MemberDeco() member: MemberDto) {
    return await this.rankingService.getMyRanking(member.memberId);
  }
}

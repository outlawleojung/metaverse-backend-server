import { GetCommonDto } from '../dto/get.common.dto';
import { JwtGuard } from '@libs/common';
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
  @UseGuards(JwtGuard)
  @Post()
  async createRanking(@Body() data: CreateRankingDto) {
    return await this.rankingService.crreateRanking(data.memberId, data.score);
  }

  @ApiOperation({ summary: '전체 랭킹, 나의 기록 모두 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetAllMyRankingResponseDto,
  })
  @UseGuards(JwtGuard)
  @Get('allMyRanking')
  async getAllMyRanking(@Body() data: GetCommonDto) {
    return await this.rankingService.getAllMyRanking(data.memberId);
  }

  @ApiOperation({ summary: '전체 랭킹만 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetAllRankingResponseDto,
  })
  @UseGuards(JwtGuard)
  @Get('allRanking')
  async getAllRanking(data: GetCommonDto) {
    return await this.rankingService.getAllRanking();
  }

  @ApiOperation({ summary: '나의 랭킹만 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetAllMyRankingResponseDto,
  })
  @UseGuards(JwtGuard)
  @Get('myRanking')
  async getMyRanking(@Body() data: GetCommonDto) {
    return await this.rankingService.getMyRanking(data.memberId);
  }
}

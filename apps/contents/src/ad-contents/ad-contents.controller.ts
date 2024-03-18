import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MorganInterceptor } from 'nest-morgan';
import { AdContentsService } from './ad-contents.service';
import { JwtGuard } from '@libs/common';
import { GetCommonDto } from '../dto/get.common.dto';
import { AdContentsRewardDto } from './dto/req/ad.contents.reward.dto';
import { AdContentsRewardResponseDto } from './dto/res/ad.contents.reward.res.dto';

@UseInterceptors(MorganInterceptor('combined'))
@ApiTags('AD-CONTENTS - 광고 컨텐츠')
@Controller('ad-contents')
export class AdContentsController {
  constructor(private readonly adContentsService: AdContentsService) {}

  // 광고 보상 받기
  @ApiOperation({ summary: '광고 보상 받기' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: AdContentsRewardResponseDto,
  })
  @UseGuards(JwtGuard)
  @Post()
  async adContentsReward(@Body() data: AdContentsRewardDto) {
    return await this.adContentsService.adContentsReward(data);
  }
}

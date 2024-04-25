import {
  Body,
  Controller,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MorganInterceptor } from 'nest-morgan';
import { AdContentsService } from './ad-contents.service';
import { AdContentsRewardDto } from './dto/req/ad.contents.reward.dto';
import { AdContentsRewardResponseDto } from './dto/res/ad.contents.reward.res.dto';
import {
  AccessTokenGuard,
  MemberDeco,
  MemberDto,
  QueryRunner,
} from '@libs/common';
import { TransactionInterceptor } from '@libs/entity';
import { QueryRunner as QR } from 'typeorm';

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
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  @Post()
  async adContentsReward(
    @QueryRunner() queryRunner: QR,
    @MemberDeco() member: MemberDto,
    @Body() data: AdContentsRewardDto,
  ) {
    return await this.adContentsService.adContentsReward(
      member.id,
      data,
      queryRunner,
    );
  }
}

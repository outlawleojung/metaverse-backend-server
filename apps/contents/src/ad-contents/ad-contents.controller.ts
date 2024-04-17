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
import { AccessTokenGuard, MemberDeco, MemberDto } from '@libs/common';

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
  @Post()
  async adContentsReward(
    @MemberDeco() member: MemberDto,
    @Body() data: AdContentsRewardDto,
  ) {
    return await this.adContentsService.adContentsReward(member.memberId, data);
  }
}

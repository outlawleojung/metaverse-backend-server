import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MorganInterceptor } from 'nest-morgan';
import { PostboxService } from './postbox.service';
import { GetPostboxesResponseDto } from './dto/res/get.postboxes.response';
import { ReceiveEachPostResponseDto } from './dto/res/receive.each.post.response';
import { ReceiveAllPostResponseDto } from './dto/res/receive.all.post.response copy';
import { AccessTokenGuard, MemberDeco } from '@libs/common';

@UseInterceptors(MorganInterceptor('combined'))
@ApiTags('POSTBOX - 우편함')
@Controller('api/postbox')
export class PostboxController {
  constructor(private readonly postboxService: PostboxService) {}

  // 우편함 목록 조회
  @ApiOperation({ summary: '우편함 목록 조회' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetPostboxesResponseDto,
  })
  @UseGuards(AccessTokenGuard)
  @Get()
  async getPostboxes(@MemberDeco('memberId') memberId: string) {
    return await this.postboxService.getPostboxes(memberId);
  }

  // 우편함 수령하기
  @ApiOperation({ summary: '우편함 개별 수령하기' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ReceiveEachPostResponseDto,
  })
  @UseGuards(AccessTokenGuard)
  @Post('recieve/:id')
  async receivePost(
    @MemberDeco('memberId') memberId: string,
    @Param('id') id: number,
  ) {
    return await this.postboxService.receivePost(memberId, id);
  }

  // 우편함 수령하기
  @ApiOperation({ summary: '우편함 전체 수령하기' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ReceiveAllPostResponseDto,
  })
  @UseGuards(AccessTokenGuard)
  @Post('receive-all')
  async receiveAppPost(@MemberDeco('memberId') memberId: string) {
    return await this.postboxService.receiveAllPost(memberId);
  }
}

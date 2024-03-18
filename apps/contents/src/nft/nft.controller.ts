import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MorganInterceptor } from 'nest-morgan';
import { NftService } from './nft.service';
import { JwtGuard } from '@libs/common';
import { LinkedWalletDto } from './dto/req/linked.wallet.dto';
import { LinkedWalletResDto } from './dto/res/linked.wallet.res.dto';
import { GetCommonDto } from '../dto/get.common.dto';

@UseInterceptors(MorganInterceptor('combined'))
@ApiTags('NFT')
@Controller('api/nft')
export class NftController {
  constructor(private readonly nftService: NftService) {}

  @ApiOperation({ summary: '지갑 연동 하기' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: LinkedWalletResDto,
  })
  @UseGuards(JwtGuard)
  @Post('linked-wallet')
  async linkedWallet(@Body() data: LinkedWalletDto) {
    return await this.nftService.linkedWallet(data.memberId, data.walletAddr);
  }

  @ApiOperation({ summary: '지갑 해제 하기' })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @UseGuards(JwtGuard)
  @Delete('unlinked-wallet')
  async unlinkedWallet(@Body() data: GetCommonDto) {
    return await this.nftService.unLinkedWallet(data.memberId);
  }
}

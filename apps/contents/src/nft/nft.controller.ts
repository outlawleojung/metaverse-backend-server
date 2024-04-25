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
import { LinkedWalletDto } from './dto/req/linked.wallet.dto';
import { LinkedWalletResDto } from './dto/res/linked.wallet.res.dto';
import { AccessTokenGuard, MemberDeco, MemberDto } from '@libs/common';

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
  @UseGuards(AccessTokenGuard)
  @Post('linked-wallet')
  async linkedWallet(
    @MemberDeco() member: MemberDto,
    @Body() data: LinkedWalletDto,
  ) {
    return await this.nftService.linkedWallet(member.id, data.walletAddr);
  }

  @ApiOperation({ summary: '지갑 해제 하기' })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @UseGuards(AccessTokenGuard)
  @Delete('unlinked-wallet')
  async unlinkedWallet(@MemberDeco() member: MemberDto) {
    return await this.nftService.unLinkedWallet(member.id);
  }
}

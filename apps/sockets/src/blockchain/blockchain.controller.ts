import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BlockchainGateway } from './blockchain.gateway';
import { ArzpassAvatarDto } from './dto/arzpass.avatar.dto';

@Controller('api/blockchain')
export class BlockchainController {
  constructor(private readonly blockchainGateway: BlockchainGateway) {}
  @ApiOperation({ summary: 'ARZPASS NFT 아바타 정보 새로고침 요청' })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @Post('/arzpass-nft-alert')
  async avatarRefresh(@Body() data: ArzpassAvatarDto) {
    console.log(data);
    return await this.blockchainGateway.avatarRefresh(data.memberId);
  }
}

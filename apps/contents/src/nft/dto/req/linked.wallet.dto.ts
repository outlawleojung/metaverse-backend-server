import { GetCommonDto } from '../../../dto/get.common.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class LinkedWalletDto extends GetCommonDto {
  @ApiProperty({
    example: 'dsfdf324rvrt23tg34t34jn76...',
    description: '지갑 주소',
  })
  @IsNotEmpty()
  @IsString()
  walletAddr: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
import { SuccessDto } from '../../../dto/success.response.dto';

export class LinkedWalletResDto extends SuccessDto {
  @ApiProperty({
    example: 'dsfdf324rvrt23tg34t34jn76...',
    description: '지갑 주소',
  })
  @IsNotEmpty()
  @IsString()
  walletAddr: string;
}

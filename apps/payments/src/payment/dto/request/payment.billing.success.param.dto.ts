import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GetPaymentBillingSuccessParamDto {
  @ApiProperty({
    example: 'c10a4d60-5fc4-11ed-9863-4d3c4792e333',
    name: 'memberId',
    description: 'memberId',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly memberId: string;

  @ApiProperty({
    example: '1201',
    name: 'productId',
    description: 'productId',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  public readonly productId: number;
}

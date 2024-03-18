import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GetPaymentSuccessDto {
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
    example: 1201,
    name: 'productId',
    description: 'productId',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly productId: string;

  @ApiProperty({
    example: 1,
    name: 'count',
    description: 'count',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly count: string;

  @ApiProperty({
    example: '15jlkhdSAFAds9134jhksdf',
    name: 'paymentKey',
    description: 'paymentKey',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly paymentKey: string;
  @ApiProperty({
    example: '20210101000000',
    name: 'orderId',
    description: 'orderId',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly orderId: string;

  @ApiProperty({
    example: '9900',
    name: 'amount',
    description: 'amount',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly amount: string;

  @ApiProperty({
    example: 'NORMAL',
    name: 'paymentType ',
    description: 'paymentType ',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly paymentType: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GetPaymentBillingSuccessDto {
  @ApiProperty({
    example: 'kzdgl1h35o435oiooafjhnkjcxnzvho1324',
    name: 'authKey',
    description: 'authKey',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly authKey: string;

  @ApiProperty({
    example: 'kl1h35ooiooafjhnkjcxnzvho',
    name: 'customerKey',
    description: 'customerKey',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly customerKey: string;

  @ApiProperty({
    example: '4900',
    name: 'amount',
    description: 'amount',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly amount: string;

  @ApiProperty({
    example: '202212684894926165',
    name: 'orderId',
    description: 'orderId',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly orderId: string;

  @ApiProperty({
    example: '아즈메타 짱짱맨 입니당',
    name: 'orderName',
    description: 'orderName',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly orderName: string;

  @ApiProperty({
    example: 'customer@email.com',
    name: 'customerEmail',
    description: 'customerEmail',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly customerEmail: string;

  @ApiProperty({
    example: '아즈메타 짱짱맨',
    name: 'customerName',
    description: 'customerName',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly customerName: string;
}

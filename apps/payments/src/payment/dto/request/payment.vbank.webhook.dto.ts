import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PostPaymentVbankWebhookDto {
  @ApiProperty({
    example: '2022-01-01 00:00:00',
    name: 'createdAt',
    description: '생성 일자',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly createdAt: string;
  @ApiProperty({
    example: 'kldjafoijsfoiu18924',
    name: 'orderId',
    description: '비밀 키',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly secret: string;

  @ApiProperty({
    example: '16454949215659494',
    name: 'amount',
    description: '주문 번호',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly orderId: string;

  @ApiProperty({
    example: '보류',
    name: 'status',
    description: '결제 상태',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly status: string;

  @ApiProperty({
    example: 'DFasdfhasuiod135',
    name: 'transactionKey',
    description: '트랜잭션 키',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly transactionKey: string;
}

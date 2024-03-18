import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class UpdatePaymentStateDto {
  @ApiProperty({
    description: '주문 번호',
    required: true,
    example: 'adsjfhasiudDSAF123',
  })
  @IsString()
  @IsNotEmpty()
  public readonly orderId: string;

  @ApiProperty({
    description: '결제 상태 타입',
    required: true,
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  public readonly paymentStateType: number;
}

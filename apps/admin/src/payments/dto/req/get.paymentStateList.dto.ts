import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class GetPaymentStateDto {
  @ApiProperty({
    description: '주문 번호',
    required: true,
    example: 'adsjfhasiudDSAF123',
  })
  @IsString()
  @IsNotEmpty()
  public readonly orderId: string;
}

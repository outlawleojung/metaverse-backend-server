import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GetPaymentFailDto {
  @ApiProperty({
    example: '존재하지 않는 결제 정보 입니다.',
    name: 'message',
    description: 'message',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly message: string;

  @ApiProperty({
    example: 'NET_F0001',
    name: 'code',
    description: 'code',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly code: string;

  @ApiProperty({
    example: 'adjfldasjfo1-3040lkdjs',
    name: 'orderId',
    description: 'orderId',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly orderId: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class AuthEmailResponseDto {
  @ApiProperty({
    example: 180,
    description: '남은 시간 (초)',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  public readonly remainTime: number;
}

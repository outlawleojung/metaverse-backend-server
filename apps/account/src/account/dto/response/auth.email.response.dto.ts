import { SuccessDto } from './../../../dto/success.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AuthEmailResponseDto extends SuccessDto {
  @ApiProperty({
    example: 180,
    description: '남은 시간 (초)',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  public readonly remainTime: number;
}

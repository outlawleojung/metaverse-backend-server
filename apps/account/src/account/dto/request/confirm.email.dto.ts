import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class ConfirmEmailDto {
  @ApiProperty({
    example: 'example@email.com',
    description: '이메일 주소',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly email: string;

  @ApiProperty({
    example: 1234,
    description: '인증 코드',
    required: true,
  })
  @IsNumber()
  public readonly authCode: number;
}

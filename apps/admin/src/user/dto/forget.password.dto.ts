import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ForgetPasswordDto {
  @ApiProperty({
    description: '이메일',
    required: true,
    example: 'test@email.com',
  })
  @IsString()
  @IsNotEmpty()
  public email: string;

  @ApiProperty({
    description: '이름',
    required: true,
    example: '최재쿠르르',
  })
  @IsString()
  @IsNotEmpty()
  public name: string;
}

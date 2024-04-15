import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'adb@email.com',
    description: '이메일 주소',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly email: string;

  @ApiProperty({
    example: '123123',
    description: '비밀번호',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly password: string;

  @ApiProperty({
    example: 1,
    description: '가입 경로',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  public readonly regPathType: number;
}

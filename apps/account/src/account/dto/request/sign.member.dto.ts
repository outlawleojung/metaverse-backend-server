import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class SignMemberDto {
  @ApiProperty({
    example: 'example@email.com',
    description: '이메일 주소 또는 소셜계정 아이디',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public accountToken: string;

  @ApiProperty({
    example: '123456',
    description: '패스워드',
    required: false,
  })
  @IsString()
  public password: string;

  @ApiProperty({
    example: 1,
    description: '가입 경로 타입 - 1. AOS, 2: iOS, 3: Web, 4: Etc',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  public readonly regPathType: number;
}

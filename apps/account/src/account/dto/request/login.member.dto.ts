import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class LogInMemberDto {
  @ApiProperty({
    example: 'exmaple@email.com',
    description: '로그인 토큰 (이메일 or 소셜아이디)',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly accountToken: string;

  @ApiProperty({
    example: 1,
    description: '회원 유형',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  public readonly providerType: number;

  @ApiProperty({
    example: 1,
    description: '가입 경로 타입',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  public readonly regPathType: number;
}

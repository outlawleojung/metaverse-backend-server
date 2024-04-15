import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, ValidateIf } from 'class-validator';

export class LinkedAccountDto {
  @ApiProperty({
    example: '93b800-9b1e-11ed-9bd3....',
    description: '연동 될 계정의 아이디 (이메일 또는 소셜 아이디)',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly accountToken: string;

  @ApiProperty({
    example: '1',
    description: '회원 유형',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  public readonly providerType: number;

  @ApiProperty({
    example: '1231231231',
    description: '패스워드 (아즈메타 로그인 연동 시 필요)',
  })
  @ValidateIf((object, value) => value !== null)
  public readonly password: string | null;
}

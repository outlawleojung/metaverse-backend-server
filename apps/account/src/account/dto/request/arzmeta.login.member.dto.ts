import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { LogInMemberDto } from './login.member.dto';

export class ArzmetaLogInMemberDto {
  @ApiProperty({
    example: 'exmaple@email.com',
    description: '로그인 토큰 (이메일 or 소셜아이디)',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly accountToken: string;

  @ApiProperty({
    example: '123456',
    description: '패스워드 (아즈메타 계정에서만 필요)',
    required: false,
  })
  @IsString()
  public readonly password: string;
}

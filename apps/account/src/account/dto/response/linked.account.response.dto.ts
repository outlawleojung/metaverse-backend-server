import { SuccessDto } from '../../../dto/success.response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class SocialLoginInfo {
  @ApiProperty({
    example: 1,
    description: '회원 유형',
  })
  providerType: number;

  @ApiProperty({
    example: 'test2@email.com',
    description: '로그인 토큰 (이메일 or 소셜아이디)',
  })
  accountToken: string;
}

export class LinkedAccountResponseDto extends SuccessDto {
  @ApiProperty({
    type: SocialLoginInfo,
    isArray: true,
    description: '로그인 연동 정보',
  })
  public socialLoginInfo: SocialLoginInfo[];
}

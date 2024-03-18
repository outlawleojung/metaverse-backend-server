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

export class MemberInfo {
  @ApiProperty({
    example: '닉네임이다',
    description: '닉네임',
  })
  nickname: string;

  @ApiProperty({
    example: '상태가 굉장히 안좋음',
    description: '상태 메세지',
  })
  stateMessage: string;

  @ApiProperty({
    type: SocialLoginInfo,
    isArray: true,
    description: '계정 연동 정보',
  })
  public socialLoginInfo: SocialLoginInfo[];

  @ApiProperty({
    example: 'DO3H61H',
    description: '회원코드',
  })
  memberCode: string;

  @ApiProperty({
    example: {
      '1': 310002,
      '4': 340006,
      '6': 360010,
    },
    description: '아바타 정보',
  })
  public avatarInfos: string;
}

export class AlreadyLinkedAccountResponseDto extends SuccessDto {
  @ApiProperty({
    type: MemberInfo,
    description: '로그인 연동 정보',
  })
  public memberInfo: MemberInfo;
}

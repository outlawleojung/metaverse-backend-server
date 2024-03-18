import { ApiProperty } from '@nestjs/swagger';

export class LoginData {
  @ApiProperty({
    example: '93b800-9b1e-11ed-9bd3....',
    description: '회원아이디',
  })
  public memberId: string;

  @ApiProperty({
    example: 'VVRCHIB...',
    description: '회원코드',
  })
  public memberCode: string;

  @ApiProperty({
    example: 1,
    description: '회원 유형',
  })
  public providerType: number;

  @ApiProperty({
    example: 1,
    description: '오피스 등급 타입',
  })
  public officeGradeType: number;

  @ApiProperty({
    example: 1,
    description: '마이룸 상태 타입',
  })
  public myRoomStateType: number;

  @ApiProperty({
    example: 'example@email.com',
    description: '이메일 주소',
    required: false,
  })
  public email: string;

  @ApiProperty({
    example: '내별명이다',
    description: '닉네임',
    required: false,
  })
  public nickname: string;

  @ApiProperty({
    example: '상태 메롱',
    description: '상태메세지',
    required: false,
  })
  public stateMessage: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp....',
    description: 'jwt 토큰',
  })
  public jwtAccessToken: string;

  @ApiProperty({
    example: '7ub800-9b134ge-11ed-9bd3....',
    description: '세션 아이디',
  })
  public sessionId: string;

  //   public // totalLoginCnt: loginInfo.totalLoginCnt,
  //   public // seqLoginCnt: loginInfo.seqLoginCnt,
  //   public // isFirstLogin: loginInfo.isFirstLogin,

  //   @ApiProperty({
  //     example: '93b800-9b1e-11ed-9bd3....',
  //     description: '로그인 토큰',
  //   })
  //   public loginToken: string;
}

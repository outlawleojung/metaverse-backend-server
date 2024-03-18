import { SuccessDto } from './../../../dto/success.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { SocialLoginInfo } from './linked.account.response.dto';
import { ERRORCODE, ERROR_MESSAGE } from '@libs/constants';

export class memberInfo {
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
    type: SocialLoginInfo,
    isArray: true,
    description: '로그인 연동 정보',
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

export class AuthEmailErrorResponseDto {
  @ApiProperty({
    example: ERRORCODE.NET_E_ALREADY_EXIST_EMAIL,
    description: '에러코드',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  public readonly error: number;

  @ApiProperty({
    example: ERROR_MESSAGE(ERRORCODE.NET_E_ALREADY_EXIST_EMAIL),
    description: '에러 메세지',
    required: true,
  })
  @IsString()
  public readonly errorMessage: string;

  @ApiProperty({
    type: memberInfo,
    description: '사용자 정보',
  })
  public memberInfo: memberInfo;
}

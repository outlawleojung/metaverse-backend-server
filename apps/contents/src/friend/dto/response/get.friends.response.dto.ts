import { SuccessDto } from './../../../dto/success.response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class FrinedInfo {
  @ApiProperty({
    example: '93b800',
    description: '친구 회원 코드',
    required: true,
  })
  public friendMemberCode: string;

  @ApiProperty({
    example: '왕방구',
    description: '친구 닉네임',
    required: false,
  })
  public frinedsNickname: string;

  @ApiProperty({
    example: '상태 좋음',
    description: '친구 상태메세지',
    required: false,
  })
  public friendMessage: string;

  @ApiProperty({
    example: '2022-09-27 13:48:25',
    description: '친구 생성 일시',
    required: false,
  })
  public createdAt: Date;

  @ApiProperty({
    example: 1,
    description: '즐겨찾기 여부',
    required: true,
  })
  public bookmark: number;

  @ApiProperty({
    example: '2022-09-27 13:48:25',
    description: '즐겨찾기 일시',
    required: false,
  })
  public bookmarkedAt: Date;

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

export class GetFriendResponseDto extends SuccessDto {
  @ApiProperty({
    example: 200,
    description: '에러 코드',
    required: true,
  })
  public error: number;

  @ApiProperty({
    example: 'NET_E_SUCESS',
    description: '에러 메세지',
    required: true,
  })
  public errorMessage: string;

  @ApiProperty({
    type: FrinedInfo,
    isArray: true,
    description: '친구 정보',
  })
  public friends: FrinedInfo[];
}

import { SuccessDto } from './../../../dto/success.response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class RequestInfo {
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
    example: '2022-09-27 13:48:25',
    description: '요청 일시',
    required: false,
  })
  public requestedAt: Date;

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

export class GetReceivedFriendsResponseDto extends SuccessDto {
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
    type: RequestInfo,
    isArray: true,
    description: '친구 요청 정보',
  })
  public friends: RequestInfo[];
}

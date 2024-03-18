import { SuccessDto } from '../../../dto/success.response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class FriendMemberDefault {
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
    example: '상태 썩음',
    description: '상태메세지',
    required: false,
  })
  public friendStateMessage: string;

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

export class FindFriendResponseDto extends SuccessDto {
  @ApiProperty({
    type: FriendMemberDefault,
    description: '친구 조회 정보',
  })
  public member: FriendMemberDefault;
}

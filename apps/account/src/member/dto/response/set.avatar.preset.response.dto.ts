import { SuccessDto } from '../../../dto/success.response.dto';
import { ApiProperty, OmitType } from '@nestjs/swagger';

export class SetAvatarPresetResponseDto extends SuccessDto {
  @ApiProperty({
    example: {
      '1': 101,
      '2': 201,
      '3': 301,
      '4': 401,
    },
    description: '아바타 정보',
  })
  public avatarInfos: string;

  @ApiProperty({
    example: '나의 이름',
    description: '닉네임',
  })
  public nickname: string;

  @ApiProperty({
    example: '지금은 부재중...',
    description: '상태 메세지',
  })
  public stateMessage: string;
}

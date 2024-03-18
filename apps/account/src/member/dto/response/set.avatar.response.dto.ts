import { SuccessDto } from '../../../dto/success.response.dto';
import { ApiProperty, OmitType } from '@nestjs/swagger';

export class SetAvatarResponseDto extends SuccessDto {
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
}

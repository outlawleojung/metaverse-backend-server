import { SuccessDto } from '../../../dto/success.response.dto';
import { ApiProperty, OmitType } from '@nestjs/swagger';

export class UpdateProfileResponseDto extends SuccessDto {
  @ApiProperty({
    example: '나의 이름은',
    description: '닉네임',
  })
  public nickname: string;

  @ApiProperty({
    example: '지금은 부재중...',
    description: '상태 메세지',
  })
  public stateMessage: string;
}

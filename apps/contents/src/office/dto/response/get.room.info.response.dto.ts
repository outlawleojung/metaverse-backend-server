import { SuccessDto } from '../../../dto/success.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ReservationInfoWithIsPassword } from './reservationInfoWithIsPassword';

export class GetRoomInfoResponseDto extends SuccessDto {
  @ApiProperty({
    type: ReservationInfoWithIsPassword,
    description: '룸 정보',
  })
  public officeRoomInfo: ReservationInfoWithIsPassword;
}

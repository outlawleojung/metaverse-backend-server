import { SuccessDto } from './../../../dto/success.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ReservationInfo } from './reservationInfo';
import { ReservationInfoWithIsPassword } from './reservationInfoWithIsPassword';

export class GetWaitingResponseDto extends SuccessDto {
  @ApiProperty({
    type: ReservationInfoWithIsPassword,
    isArray: true,
    description: '대기 정보',
  })
  public myWaitings: ReservationInfoWithIsPassword[];
}

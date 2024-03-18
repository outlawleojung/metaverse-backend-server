import { SuccessDto } from './../../../dto/success.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ReservationInfo } from './reservationInfo';

export class GetReservResponseDto extends SuccessDto {
  @ApiProperty({
    type: ReservationInfo,
    isArray: true,
    description: '예약 정보',
  })
  public myReservations: ReservationInfo[];
}

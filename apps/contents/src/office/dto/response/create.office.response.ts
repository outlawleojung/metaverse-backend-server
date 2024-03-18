import { SuccessDto } from './../../../dto/success.response.dto';
import { MemberOfficeReservationInfo } from '@libs/entity';
import { ApiProperty } from '@nestjs/swagger';
import { ReservationInfo } from './reservationInfo';

export class CreateOfficeResponseDto extends SuccessDto {
  @ApiProperty({
    type: ReservationInfo,
    description: '예약 정보',
  })
  public myReservation: ReservationInfo;
}

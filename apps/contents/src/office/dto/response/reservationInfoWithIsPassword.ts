import { ApiProperty } from '@nestjs/swagger';
import { DefaultReservationInfo } from './defaultReservationInfo';

export class ReservationInfoWithIsPassword extends DefaultReservationInfo {
  @ApiProperty({
    example: 1,
    description: '패스워드 여부',
    required: true,
  })
  public isPassword: number;
}

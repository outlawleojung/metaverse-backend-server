import { ApiProperty } from '@nestjs/swagger';
import { DefaultReservationInfo } from './defaultReservationInfo';

export class ReservationInfo extends DefaultReservationInfo {
  @ApiProperty({
    example: '12345',
    description: '패스워드',
    required: true,
  })
  public password: string;

  @ApiProperty({
    example: 1,
    description: '패스워드 여부',
    required: true,
  })
  public isPassword: number;
}

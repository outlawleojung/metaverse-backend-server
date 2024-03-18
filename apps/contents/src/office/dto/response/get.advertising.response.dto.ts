import { SuccessDto } from './../../../dto/success.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ReservationInfoWithIsPassword } from './reservationInfoWithIsPassword';

export class GetAdvertisingResponseDto extends SuccessDto {
  @ApiProperty({
    type: ReservationInfoWithIsPassword,
    isArray: true,
    description: '홍보 정보',
  })
  public advertisingOfficeList: ReservationInfoWithIsPassword[];
}

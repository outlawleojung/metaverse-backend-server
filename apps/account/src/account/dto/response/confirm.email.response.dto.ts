import { SuccessDto } from '../../../dto/success.response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ConfirmEmailResponseDto extends SuccessDto {
  @ApiProperty({
    example: 1234,
    description: '인증 코드',
  })
  public authCode: number;
}

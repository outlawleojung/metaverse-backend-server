import { SuccessDto } from './../../../dto/success.response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteReservResponseDto extends SuccessDto {
  @ApiProperty({
    example: 200,
    description: '에러 코드',
    required: true,
  })
  public error: number;

  @ApiProperty({
    example: 'NET_E_SUCESS',
    description: '에러 메세지',
    required: true,
  })
  public errorMessage: string;

  @ApiProperty({
    example: '5928912391',
    description: '룸코드',
    required: true,
  })
  public roomCode: string;
}

import { SuccessDto } from '../../../dto/success.response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class LoginAuthResponseDto extends SuccessDto {
  @ApiProperty({
    example: '93b800-9b1e-11ed-9bd3....',
    description: '회원 아이디',
    required: true,
  })
  public memberId: string;
}

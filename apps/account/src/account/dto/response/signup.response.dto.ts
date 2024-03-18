import { SuccessDto } from '../../../dto/success.response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpResponseDto extends SuccessDto {
  public memberId: string;

  @ApiProperty({
    example: '800-9b1e-11ed-9bd3....',
    description: '로그인 토큰 (아즈메타 로그인 회원 전용)',
    required: false,
  })
  public loginToken: string;
}

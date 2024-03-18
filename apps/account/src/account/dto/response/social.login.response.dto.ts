import { SuccessDto } from '../../../dto/success.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { LoginData } from './login.data.dto';

export class SocialLoginData extends LoginData {}

export class SocialLoginResponseDto extends SuccessDto {
  @ApiProperty({
    example: 'dfk3fdg-12124df-32412...',
    description: '회원 아이디',
  })
  public memberId: string;
}

import { SuccessDto } from '../../../dto/success.response.dto';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { LoginData } from './login.data.dto';

export class AutoLoginData extends LoginData {
  @ApiProperty({
    example: 'test01@gmail.com',
    description: '이메일 주소',
  })
  public email: string;
}

export class AutoLoginResponseDto extends SuccessDto {
  @ApiProperty({
    type: AutoLoginData,
    description: '로그인 데이터',
  })
  public memberInfo: AutoLoginData;
}

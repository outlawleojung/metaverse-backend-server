import { SuccessDto } from '../../../dto/success.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { LoginData } from './login.data.dto';

export class AzmetaLoginData extends LoginData {
  @ApiProperty({
    example: '93b800-9b1e-11ed-9bd3....',
    description: '로그인 토큰',
  })
  public loginToken: string;

  @ApiProperty({
    example: 'test01@gmail.com',
    description: '이메일 주소',
  })
  public email: string;
}

export class AzmetaLoginResponseDto extends SuccessDto {
  @ApiProperty({
    type: AzmetaLoginData,
    description: '로그인 데이터',
  })
  public memberInfo: AzmetaLoginData;
}

import { SuccessDto } from '../../../dto/success.response.dto';
import { ApiProperty, OmitType } from '@nestjs/swagger';

export class GetUpdateCardInfoResponseDto extends SuccessDto {
  @ApiProperty({
    example: [
      {
        templateId: 2,
        num: 3,
        name: '한효주',
        job: '개발자',
        phone: '010-1234-5678',
        email: 'gksgywn@email.com',
      },
    ],

    description: '명함 정보',
  })
  public businessCardInfos: string;
}

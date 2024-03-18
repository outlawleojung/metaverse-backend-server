import { SuccessDto } from '../../../dto/success.response.dto';
import { ApiProperty, OmitType } from '@nestjs/swagger';

export class GetMoneyInfoResponseDto extends SuccessDto {
  @ApiProperty({
    example: [
      {
        moneyType: 1,
        count: 10,
      },
      {
        moneyType: 3,
        count: 20,
      },
    ],
    description: '앱 정보 : 컨텐츠 온오프 정보, 스크린 정보, 배너 정보',
  })
  public moneyInfos: string;
}

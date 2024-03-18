import { GetCommonDto } from '../../../dto/get.common.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AdContentsRewardResponseDto extends GetCommonDto {
  @ApiProperty({
    example: 10001,
    description: '광고 컨텐츠 아이디',
    required: false,
  })
  @IsNumber()
  public readonly contentsId: number;

  @ApiProperty({
    example: 1,
    description: '재화 타입',
    required: false,
  })
  @IsNumber()
  public readonly moneyType: number;

  @ApiProperty({
    example: 100,
    description: '보상 갯수',
    required: false,
  })
  @IsNumber()
  public readonly reward: number;
}

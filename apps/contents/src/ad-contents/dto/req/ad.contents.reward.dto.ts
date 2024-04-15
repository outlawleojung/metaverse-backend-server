import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AdContentsRewardDto {
  @ApiProperty({
    example: 10001,
    description: '광고 컨텐츠 아이디',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  public readonly contentsId: number;
}

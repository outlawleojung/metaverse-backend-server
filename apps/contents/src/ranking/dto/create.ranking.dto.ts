import { GetCommonDto } from './../../dto/get.common.dto';
import { ApiProperty } from '@nestjs/swagger';
import { MemberRaking } from './get.all.ranking.response.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateRankingDto extends GetCommonDto {
  @ApiProperty({
    example: 1.23,
    description: '스코어',
  })
  @IsNumber()
  @IsNotEmpty()
  public score: number;
}

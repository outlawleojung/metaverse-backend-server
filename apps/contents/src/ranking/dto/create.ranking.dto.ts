import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateRankingDto {
  @ApiProperty({
    example: 1.23,
    description: '스코어',
  })
  @IsNumber()
  @IsNotEmpty()
  public score: number;
}

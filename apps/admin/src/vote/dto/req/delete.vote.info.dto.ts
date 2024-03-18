import { ApiProperty, ApiQuery } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class DeleteVoteInfoDto {
  @ApiProperty({
    name: 'voteId',
    description: 'voteId',
    required: true,
    example: 1,
  })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  public readonly voteId: number;
}

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class GetBlobListDto {
  @ApiProperty({
    name: 'page',
    description: '페이지',
    required: true,
    example: 1,
  })
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  public readonly page: number;

  @ApiProperty({
    name: 'searchType',
    description: '검색 타입',
    required: false,
    example: 'ALL',
  })
  @IsOptional()
  @IsString()
  public readonly searchType: string | null;
}

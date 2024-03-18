import { ApiProperty, ApiQuery } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class GetVoteResultListInfoDto {
  @ApiProperty({
    example: 1,
    name: 'limit',
    description: 'limit',
    required: false,
  })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  public readonly limit: number;

  @ApiProperty({
    example: 1,
    name: 'filterValue',
    description: 'filterValue',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  public readonly filterValue: number | 0;

  //lastDt
  @ApiProperty({
    example: '20210101000000',
    name: 'lastDt',
    description: 'lastDt',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  public readonly lastDt: number | null;

  @IsOptional()
  @IsString()
  public readonly searchType: string | null;

  @ApiProperty({
    name: 'searchValue',
    description: '검색 값',
    required: false,
    example: 'test',
  })
  @IsOptional()
  @IsString()
  public readonly searchValue: string | null;
}

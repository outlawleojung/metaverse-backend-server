import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsNotEmpty } from 'class-validator';

export class GetLogDto {
  @ApiProperty({
    name: 'searchType',
    description: '검색 타입',
    required: false,
    example: 'ALL',
  })
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

  @ApiProperty({
    example: 1,
    name: 'limit',
    description: 'limit',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  public readonly limit: number;

  @ApiProperty({
    example: '20210101000000',
    name: 'lastDt',
    description: 'lastDt',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  public readonly lastDt: number | null;
}

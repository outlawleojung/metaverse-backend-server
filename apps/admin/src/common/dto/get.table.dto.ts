import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class GetTableDto {
  @ApiProperty({
    name: 'page',
    description: '페이지',
    required: false,
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  public readonly page: number | null;

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
    name: 'orderType',
    description: '정렬 타입',
    required: false,
    example: 'createdAt',
  })
  @IsOptional()
  @IsString()
  public readonly orderType: string | null;

  @ApiProperty({
    name: 'orderValue',
    description: '정렬 차순',
    required: false,
    example: 'ASC',
  })
  @IsOptional()
  @IsString()
  public readonly orderValue: string | null;
}

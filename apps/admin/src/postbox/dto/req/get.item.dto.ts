import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class GetItemDto {
  @ApiProperty({
    name: 'searchType',
    description: '검색 타입',
    required: false,
    example: 'NAME',
  })
  @IsOptional()
  @IsString()
  public readonly searchType: string | null;

  @ApiProperty({
    name: 'searchValue',
    description: '검색 값',
    required: false,
    example: '선물 상자',
  })
  @IsOptional()
  @IsString()
  public readonly searchValue: string | null;

  @ApiProperty({
    name: 'categoryType',
    description: '카테고리 타입',
    required: false,
    example: 2,
  })
  @IsOptional()
  @IsNumber()
  public readonly categoryType: number | null;

  @ApiProperty({
    name: 'itemType',
    description: '아이템 타입',
    required: false,
    example: 2,
  })
  @IsOptional()
  @IsNumber()
  public readonly itemType: number | null;

  @ApiProperty({
    example: '선물상자2',
    name: 'lastItemName',
    description: '마지막 항목 이름',
    required: false,
  })
  @IsOptional()
  @IsString()
  public readonly lastItemName: string | null;

  @ApiProperty({
    example: 'ㄱ',
    name: 'text',
    description: '검색 초성',
    required: false,
  })
  @IsOptional()
  @IsString()
  public readonly text: string | null;
}

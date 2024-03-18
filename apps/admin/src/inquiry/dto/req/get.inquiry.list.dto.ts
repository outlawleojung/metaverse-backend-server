import { GetTableDto } from '../../../common/dto/get.table.dto';
import { ApiProperty } from '@nestjs/swagger';

import { IsString, IsNumber, IsOptional } from 'class-validator';

export class GetInquiryListDto extends GetTableDto {
  @ApiProperty({
    description: '기간 검색 unix timestamp',
    required: false,
    example: '1650402034|167059059',
  })
  @IsOptional()
  @IsString()
  public readonly searchDateTime: string | null;

  @ApiProperty({
    description: '문의 타입',
    required: false,
    example: 6,
  })
  @IsOptional()
  @IsNumber()
  public readonly searchInquiryType: number | null;

  @ApiProperty({
    description: '답변 타입',
    required: false,
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  public readonly answerType: number | null;
}

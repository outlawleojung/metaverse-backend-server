import { GetTableDto } from '../../../common/dto/get.table.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class GetReportListDto extends GetTableDto {
  @ApiProperty({
    description: '기간 검색 unix timestamp',
    required: false,
    example: '1650402034|167059059',
  })
  @IsOptional()
  @IsString()
  public readonly searchDateTime: string | null;

  @ApiProperty({
    description: '신고 타입',
    required: false,
    example: 3,
  })
  @IsOptional()
  @IsNumber()
  public readonly reportType: number | null;

  @ApiProperty({
    description: '사유 타입',
    required: false,
    example: 3,
  })
  @IsOptional()
  @IsNumber()
  public readonly reasonType: number | null;

  @ApiProperty({
    description: '상태 타입',
    required: false,
    example: 3,
  })
  @IsOptional()
  @IsNumber()
  public readonly stateType: number | null;
}

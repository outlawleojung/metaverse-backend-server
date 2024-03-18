import { ReportCategory, ReportReasonType, ReportType } from '@libs/entity';
import { ApiProperty, ApiQuery } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  ValidateIf,
  IsEmail,
} from 'class-validator';

export class GetConstantResponseDto {
  @ApiProperty({
    type: ReportCategory,
    description: '신고 카테고리 타입',
    isArray: true,
  })
  public readonly ReportCatagory: ReportCategory[];

  @ApiProperty({
    type: ReportType,
    description: '신고 유형 타입',
    isArray: true,
  })
  public readonly ReportType: ReportType[];

  @ApiProperty({
    type: ReportReasonType,
    description: '신고 상세 사유 타입',
    isArray: true,
  })
  public readonly ReportReasonType: ReportReasonType[];
}

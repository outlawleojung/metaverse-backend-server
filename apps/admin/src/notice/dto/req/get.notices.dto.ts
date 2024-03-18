import { GetTableDto } from '../../../common/dto/get.table.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class GetNoticesDto extends GetTableDto {
  @ApiProperty({
    description: '공지 사항 타입',
    required: false,
    example: 2,
  })
  @IsNumber()
  @IsOptional()
  public readonly noticeType: number | null;
}

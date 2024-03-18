import { GetTableDto } from './../../../common/dto/get.table.dto';

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateEventDto extends GetTableDto {
  @ApiProperty({
    description: '행사 이름',
    required: true,
    example: '우리동네 대잔치',
  })
  @IsString()
  @IsOptional()
  public readonly name: string | null;

  @ApiProperty({
    description: '행사 장소',
    example: 2001,
  })
  @IsNumber()
  @IsOptional()
  public readonly eventSpaceType: number | null;

  @ApiProperty({
    description: '행사 시작 일시',
    example: '2023-09-27 00:00:00',
  })
  @IsString()
  @IsOptional()
  public readonly startedAt: string | null;

  @ApiProperty({
    description: '행사 종료 일시',
    example: '2023-10-27 00:00:00',
  })
  @IsString()
  @IsOptional()
  public readonly endedAt: string | null;
}

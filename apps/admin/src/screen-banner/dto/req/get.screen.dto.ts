import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { GetTableDto } from '../../../common/dto/get.table.dto';

export class GetScreenBannerDTO extends GetTableDto {
  @ApiProperty({
    description: '공간 타입',
    required: false,
    example: 2,
  })
  @IsOptional()
  @IsString()
  public readonly spaceType: string[] | null;

  @ApiProperty({
    description: '공간 상세 타입',
    required: false,
    example: 21001,
  })
  @IsOptional()
  @IsString()
  public readonly spaceDetailType: string[] | null;
}

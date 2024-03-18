import { GetTableDto } from '../../../common/dto/get.table.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class DeleteGateWayDto extends GetTableDto {
  @ApiProperty({
    name: 'osType',
    description: 'osType',
    required: true,
    example: 1,
  })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  public readonly osType: number;

  @ApiProperty({
    name: 'appVersion',
    description: 'appVersion',
    required: true,
    example: '0.0.1',
  })
  @IsString()
  @IsNotEmpty()
  public readonly appVersion: string;
}

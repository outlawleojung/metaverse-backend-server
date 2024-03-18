import { ApiProperty } from '@nestjs/swagger';
import { GetTableDto } from '../../../common/dto/get.table.dto';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class AddGateWayRegisterDto extends GetTableDto {
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

  @ApiProperty({
    name: 'serverType',
    description: 'serverType',
    required: true,
    example: 1,
  })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  public readonly serverType: number;

  @ApiProperty({
    name: 'serverState',
    description: 'serverState',
    required: true,
    example: 1,
  })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  public readonly serverState: number;

  @ApiProperty({
    description: 'msgId',
    example: 1,
  })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  public readonly msgId: number | null;

  @ApiProperty({
    description: 'stateMessage',
    required: true,
    example: '업데이트가 필요합니다.',
  })
  @Type(() => String)
  @IsString()
  @IsOptional()
  public readonly stateMessage: string | null;
}

import { GetTableDto } from '../../../common/dto/get.table.dto';
import { ApiProperty, ApiQuery } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsNumber, ValidateIf } from 'class-validator';

export class AddVoteRegisterDto {
  @ApiProperty({
    name: 'divType',
    description: 'divType',
    required: true,
    example: 1,
  })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  public readonly divType: number;

  @ApiProperty({
    name: 'alterResType',
    description: 'alterResType',
    required: true,
    example: 1,
  })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  public readonly alterResType: number;

  @ApiProperty({
    name: 'name',
    description: 'name',
    required: true,
    example: '투표',
  })
  @IsString()
  @IsNotEmpty()
  public readonly name: string;

  @ApiProperty({
    name: 'question',
    description: 'question',
    required: true,
    example: '투표',
  })
  @IsString()
  @IsNotEmpty()
  public readonly question: string;

  @ApiProperty({
    name: 'resType',
    description: 'resType',
    required: true,
    example: 1,
  })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  public readonly resType: number;

  @ApiProperty({
    name: 'resultExposureType',
    description: 'resultExposureType',
    required: true,
    example: 1,
  })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  public readonly resultExposureType: number;

  @ApiProperty({
    name: 'isExposingResult',
    description: 'isExposingResult',
    required: true,
    example: 1,
  })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  public readonly isExposingResult: number;

  @ApiProperty({
    name: 'isEnabledEdit',
    description: 'isEnabledEdit',
    required: true,
    example: 1,
  })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  public readonly isEnabledEdit: number;

  @ApiProperty({
    name: 'startedAt',
    description: 'startedAt',
    required: true,
    example: '2021-01-01 00:00:00',
  })
  @IsString()
  @IsNotEmpty()
  public readonly startedAt: string;

  @ApiProperty({
    name: 'endedAt',
    description: 'endedAt',
    required: true,
    example: '2021-01-01 00:00:00',
  })
  @IsString()
  @IsNotEmpty()
  public readonly endedAt: string;

  @ApiProperty({
    name: 'resultEndedAt',
    description: 'resultEndedAt',
    required: true,
    example: '2021-01-01 00:00:00',
  })
  @IsString()
  @IsNotEmpty()
  public readonly resultEndedAt: string;

  @ValidateIf((object, value) => value !== null)
  public readonly image: string | File | null;
}

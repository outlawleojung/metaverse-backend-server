import { GetTableDto } from '../../../common/dto/get.table.dto';
import { ApiProperty, ApiQuery } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsNumber, IsDate, IsOptional } from 'class-validator';

export class UpdateVoteInfoDto extends GetTableDto {
  @IsString()
  @IsOptional()
  public adminId: number;

  @ApiProperty({
    description: '투표 이름',
    required: false,
    example: '짜장면이 짬뽕 보다 맛있다',
  })
  @IsOptional()
  @IsString()
  public readonly name: string | null;

  @ApiProperty({
    description: '투표 질문',
    required: false,
    example: '짜장면이 좋냐 짬뽕이 좋냐',
  })
  @IsOptional()
  @IsString()
  public readonly question: string | null;

  @ApiProperty({
    description: '투표 결과 노출 타입',
    required: false,
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  public readonly resultExposureType: number | null;

  @ApiProperty({
    description: '투표 결과 공개 여부',
    required: false,
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  public readonly isExposingResult: number;

  @ApiProperty({
    description: 'isEnabledEdit',
    required: false,
    example: '투표 수정 가능 여부',
  })
  @IsNumber()
  @IsOptional()
  public readonly isEnabledEdit: number | null;

  @ApiProperty({
    description: '투표 종료 시간',
    required: false,
    example: '2023-01-23 16:30:00',
  })
  @IsDate()
  @IsOptional()
  public readonly endedAt: Date;

  @ApiProperty({
    description: '투표 결과 공개 종료 시간',
    required: false,
    example: '2023-01-23 16:30:00',
  })
  @IsDate()
  @IsOptional()
  public readonly resultEndedAt: Date;

  @ApiProperty({
    example: '2023-01-23 16:30:00',
    name: 'startedAt',
    description: '투표 시작 시간',
    required: false,
  })
  @IsDate()
  @IsOptional()
  public readonly startedAt: Date;
}

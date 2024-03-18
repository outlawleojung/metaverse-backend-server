import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class GetSelectVoteListDto {
  @ApiProperty({
    description: '선택 투표 아이디',
    example: 10,
  })
  @IsNumber()
  public id: number;

  @ApiProperty({
    description: '결과 타입',
    example: 3,
  })
  @IsNumber()
  public resultType: number;

  @ApiProperty({
    description: '결과 타입 이름',
    example: '상시 노출',
  })
  @IsString()
  public resultTypename: string;

  @ApiProperty({
    description: '결과 노출 타입',
    example: 10,
  })
  @IsNumber()
  public resultExposureType: number;

  @ApiProperty({
    description: '결과 노출 타입 이름',
    example: 10,
  })
  @IsString()
  public resultExposureTypeName: string;

  @ApiProperty({
    description: '상태 타입',
    example: 2,
  })
  @IsNumber()
  public stateType: number;

  @ApiProperty({
    description: '상태 타입 이름',
    example: '투표 진행 & 결과 노출',
  })
  @IsString()
  public stateName: string;

  @ApiProperty({
    description: '항목 여부',
    example: 0,
  })
  @IsNumber()
  public hasItem: number;

  @ApiProperty({
    description: '투표 이름',
    example: '투표 테스트 입니다.',
  })
  @IsString()
  public name: string;

  @ApiProperty({
    description: '투표 시작 일시',
    example: '2023-08-12 10:34:23',
  })
  @IsString()
  public startedAt: string;

  @ApiProperty({
    description: '투표 종료 일시',
    example: '2023-08-12 10:34:23',
  })
  @IsString()
  public endedAt: string;

  @ApiProperty({
    description: '결과 노출 시작 일시',
    example: '2023-08-12 10:34:23',
  })
  @IsString()
  public resultStartedAt: string;

  @ApiProperty({
    description: '결과 노출 종료 일시',
    example: '2023-08-12 10:34:23',
  })
  @IsString()
  public resultEndedAt: string;
}

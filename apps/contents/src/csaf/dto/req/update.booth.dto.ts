import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBoothDto {
  @ApiProperty({
    example: '서울대학교 부스',
    description: '전시 부스 이름',
    required: true,
  })
  @IsString()
  @IsOptional()
  public readonly name: string | null;

  @ApiProperty({
    example: 1,
    description: '토픽 타입',
    required: true,
  })
  @IsString()
  @IsOptional()
  public readonly topicType: string | null;

  @ApiProperty({
    example: '서울대학교 전시 부스 입니다.',
    description: '부스 설명',
    required: true,
  })
  @IsString()
  @IsOptional()
  public readonly description: string | null;

  @ApiProperty({
    example: 1001,
    description: '룸 정보 아이디',
    required: true,
  })
  @IsString()
  @IsOptional()
  public readonly spaceInfoId: string | null;

  @ApiProperty({
    example: 1,
    description: '썸네일 삭제 여부',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly isDelete: number;
}

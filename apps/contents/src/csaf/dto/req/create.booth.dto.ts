import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBoothDto {
  @ApiProperty({
    example: '서울대학교 부스',
    description: '전시 부스 이름',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly name: string;

  @ApiProperty({
    example: 1,
    description: '토픽 타입',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly topicType: string;

  @ApiProperty({
    example: '서울대학교 전시 부스 입니다.',
    description: '부스 설명',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly description: string;

  @ApiProperty({
    example: 1001,
    description: '룸 정보 아이디',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly spaceInfoId: string;
}

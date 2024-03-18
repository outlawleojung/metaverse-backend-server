import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseCreatBoothDto {
  @ApiProperty({
    example: 3231,
    description: '부스 아이디',
  })
  @IsNumber()
  public readonly id: number;

  @ApiProperty({
    example: '123123253241',
    description: '룸코드',
  })
  @IsString()
  public readonly roomCode: string;

  @ApiProperty({
    example: '서울대학교 부스',
    description: '전시 부스 이름',
  })
  @IsString()
  public readonly name: string;

  @ApiProperty({
    example: 1,
    description: '토픽 타입',
  })
  @IsString()
  public readonly topicType: string;

  @ApiProperty({
    example: '서울대학교 전시 부스 입니다.',
    description: '부스 설명',
  })
  @IsString()
  public readonly description: string;

  @ApiProperty({
    example: 1001,
    description: '룸 정보 아이디',
  })
  @IsString()
  public readonly spaceInfoId: string;

  @ApiProperty({
    example: 'image.jpg',
    description: '썸네일',
  })
  @IsString()
  public readonly thumbnail: string;

  @ApiProperty({
    example: '삼식이',
    description: '닉네임',
  })
  @IsString()
  public readonly nickname: string;

  @ApiProperty({
    example: 'AD3H7G1',
    description: '회원코드',
  })
  @IsString()
  public readonly memberCode: string;

  @ApiProperty({
    example: '3f5570b0-4d3a-11ee-b',
    description: '회원아이디',
  })
  @IsString()
  public readonly memberId: string;
}

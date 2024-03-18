import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  IsArray,
} from 'class-validator';

export class PostboxAppendItem {
  @ApiProperty({
    description: '첨부 타입',
    required: true,
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  public readonly appendType: number;

  @ApiProperty({
    description: '첨부 아이템 아이디',
    required: true,
    example: 3001,
  })
  @IsNumber()
  @IsNotEmpty()
  public readonly appendValue: number;

  @ApiProperty({
    description: '첨부 아이템 수량',
    required: true,
    example: 5,
  })
  @IsNumber()
  @IsNotEmpty()
  public readonly count: number;

  @ApiProperty({
    description: '정렬 순서',
    required: true,
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  public readonly orderNum: number;
}

export class SendFullMailingDto {
  @ApiProperty({
    description: '제목',
    required: true,
    example: '런칭 이벤트 깜짝 선물',
  })
  @IsString()
  @IsNotEmpty()
  public readonly subject: string;

  @ApiProperty({
    description: '우편 타입',
    required: true,
    example: 2,
  })
  @IsNumber()
  @IsNotEmpty()
  public readonly postalType: number;

  @ApiProperty({
    description: '발송 시간',
    required: true,
    example: '2023-05-20 12:30:00',
  })
  @IsString()
  @IsNotEmpty()
  public readonly sendedAt: string;

  @ApiProperty({
    description: '보관 기간',
    required: true,
    example: 10,
  })
  @IsNumber()
  @IsNotEmpty()
  public readonly period: number;

  @ApiProperty({
    description: '요약 내용',
    required: true,
    example: '런칭 이벤트 깜짝 선물을 드립니다.',
  })
  @IsString()
  @IsNotEmpty()
  public readonly summary: string;

  @ApiProperty({
    description: '상세 내용',
    required: true,
    example: '런칭 이벤트 깜짝 선물을 드립니다. 블라 블라 블라',
  })
  @IsString()
  @IsOptional()
  public readonly content: string | null;

  @ApiProperty({
    description: '첨부 아이템',
    required: true,
    type: PostboxAppendItem,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  public readonly appendItems: PostboxAppendItem[] | null;
}

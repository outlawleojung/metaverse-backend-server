import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsNotEmpty,
} from 'class-validator';

export class EditItem {
  @ApiProperty({
    description: '아이디',
    example: 12,
  })
  @IsNumber()
  @IsOptional()
  id: number | null;

  @ApiProperty({
    description: '액션 타입',
    required: true,
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  actionType: number;

  @ApiProperty({
    description: '첨부 타입',
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  appendType: number | null;

  @ApiProperty({
    description: '첨부 아이디',
    example: 30211,
  })
  @IsNumber()
  @IsOptional()
  appendValue: number | null;

  @ApiProperty({
    description: '수량',
    example: 100,
  })
  @IsNumber()
  @IsOptional()
  count: number | null;

  @ApiProperty({
    description: '우선순위',
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  orderNum: number | null;
}

export class EditMember {
  @ApiProperty({
    description: '회원 아이디',
    required: false,
    example: '0e1cd460-b31c-11ed-9e80-7b6b7d97c65',
  })
  @IsString()
  @IsNotEmpty()
  memberId: string;

  @ApiProperty({
    description: '액션 타입',
    required: true,
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  actionType: number;
}

export class UpdteMailingDto {
  @ApiProperty({
    description: '페이지',
    required: true,
    example: 2,
  })
  @IsNumber()
  @IsNotEmpty()
  public page: number;

  @ApiProperty({
    description: '우편 아이디',
    required: true,
    example: 223,
  })
  @IsNumber()
  @IsNotEmpty()
  public postboxId: number;

  @ApiProperty({
    description: '제목',
    required: false,
    example: '런칭 이벤트 깜짝 선물',
  })
  @IsString()
  @IsOptional()
  public readonly subject: string;

  @ApiProperty({
    description: '우편 타입',
    required: false,
    example: 2,
  })
  @IsNumber()
  @IsOptional()
  public readonly postalType: number;

  @ApiProperty({
    description: '발송 시간',
    example: '2023-05-20 12:30:00',
  })
  @IsString()
  @IsOptional()
  public readonly sendedAt: string;

  @ApiProperty({
    description: '보관 기간',
    example: 10,
  })
  @IsNumber()
  @IsOptional()
  public readonly period: number;

  @ApiProperty({
    description: '요약 내용',
    example: '런칭 이벤트 깜짝 선물을 드립니다.',
  })
  @IsString()
  @IsOptional()
  public readonly summary: string;

  @ApiProperty({
    description: '상세 내용',
    example: '런칭 이벤트 깜짝 선물을 드립니다. 블라 블라 블라',
  })
  @IsString()
  @IsOptional()
  public readonly content: string;

  @ApiProperty({
    description: '첨부 아이템',
    required: false,
    type: EditItem,
  })
  @IsOptional()
  public readonly appendItems: EditItem[];

  @ApiProperty({
    description: '회원 아이디',
    required: true,
    example: [
      { memberId: '0e1cd460-b31c-11ed-9e80-7b6b7d97c65', actionType: 1 },
      { memberId: '2c7f4ea0-c92f-11ed-9893-d5465f6f4bf', actionType: 3 },
    ],
  })
  @IsArray()
  @IsOptional()
  public readonly memberIds: EditMember[];
}

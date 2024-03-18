import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty, IsArray } from 'class-validator';

export class NoticeInfo {
  @ApiProperty({
    description: '아이디',
    required: true,
    example: 2,
  })
  @IsNumber()
  @IsNotEmpty()
  public readonly id: number;

  @ApiProperty({
    description: '공지 사항 타입',
    required: true,
    example: 2,
  })
  @IsNumber()
  @IsNotEmpty()
  public readonly noticeType: number;

  @ApiProperty({
    description: '공지 사항 타입 이름',
    required: true,
    example: '공지사항',
  })
  @IsString()
  @IsNotEmpty()
  public readonly noticeTypeName: string;

  @ApiProperty({
    description: '제목',
    required: true,
    example: '결제 시스템 업데이트',
  })
  @IsString()
  @IsNotEmpty()
  public readonly subject: string;

  @ApiProperty({
    description: '시작 일시',
    required: true,
    example: '2023-11-01 00:00',
  })
  @IsString()
  @IsNotEmpty()
  public readonly startedAt: string;

  @ApiProperty({
    description: '종료 일시',
    required: true,
    example: '2023-11-31 23:59',
  })
  @IsString()
  @IsNotEmpty()
  public readonly endedAt: string;

  @ApiProperty({
    description: '언어',
    required: true,
    example: '한국어',
  })
  @IsString()
  @IsNotEmpty()
  public readonly language: string;

  @ApiProperty({
    description: '등록 일시',
    required: true,
    example: '2023-10-10 15:23',
  })
  @IsString()
  @IsNotEmpty()
  public readonly createdAt: string;

  @ApiProperty({
    description: '담당자',
    required: true,
    example: '최승욱',
  })
  @IsString()
  @IsNotEmpty()
  public readonly adminName: string;
}

export class ResponseGetNoticesDto {
  @ApiProperty({
    description: '공지 사항 목록',
    required: true,
    type: NoticeInfo,
    isArray: true,
  })
  @IsArray()
  @IsNotEmpty()
  public readonly rows: NoticeInfo[];

  @ApiProperty({
    description: '공지 사항 목록 총 개수',
    required: true,
    example: 29,
  })
  @IsNumber()
  @IsNotEmpty()
  public readonly count: number;
}

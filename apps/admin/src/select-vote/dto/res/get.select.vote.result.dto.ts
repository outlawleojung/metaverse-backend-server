import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsArray } from 'class-validator';

export class SelelctVoteResultItem {
  @ApiProperty({
    description: '회원 코드',
    required: true,
    example: 'D35BASV41GH',
  })
  @IsNumber()
  @IsNotEmpty()
  public memberCode: number;

  @ApiProperty({
    description: '닉네임',
    required: true,
    example: '삼식이',
  })
  @IsString()
  @IsNotEmpty()
  public nickName: string;

  @ApiProperty({
    description: '투표 일시',
    required: true,
    example: '2023-08-12 10:34:23',
  })
  @IsString()
  @IsNotEmpty()
  public createdAt: string;

  @ApiProperty({
    description: '번호',
    required: true,
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  public itemNum: number;

  @ApiProperty({
    description: '항목 이름',
    required: true,
    example: '제니',
  })
  @IsNumber()
  @IsString()
  public name: string;
}

export class GetSelectVoteResultDto {
  @ApiProperty({
    description: '투표 결과 조회',
    isArray: true,
    type: SelelctVoteResultItem,
  })
  @IsArray()
  public memberVoteList: SelelctVoteResultItem[];
}

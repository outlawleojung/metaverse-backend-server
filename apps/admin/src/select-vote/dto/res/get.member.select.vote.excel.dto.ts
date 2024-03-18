import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class GetMemberSelectVoteExcelDto {
  @ApiProperty({
    description: '이메일',
    example: 'test@email.com',
  })
  @IsString()
  public email: string;

  @ApiProperty({
    description: '투표 일시',
    example: '2023-09-12 12:34:12',
  })
  @IsString()
  public createdAt: string;

  @ApiProperty({
    description: '항목 번호',
    example: 3,
  })
  @IsNumber()
  public itemNum: number;

  @ApiProperty({
    description: '항목 이름',
    example: '샤브샤브',
  })
  @IsString()
  public name: string;
}

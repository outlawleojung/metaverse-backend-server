import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class GetSelelctVoteItemDetailDto {
  @ApiProperty({
    description: '항목 번호',
    example: 10,
  })
  @IsNumber()
  public itemNum: number;

  @ApiProperty({
    description: '노출 번호',
    example: 2,
  })
  @IsNumber()
  public displayNum: number;

  @ApiProperty({
    description: '항목 이름',
    example: '장원영',
  })
  @IsNumber()
  public name: string;

  @ApiProperty({
    description: '소개',
    example: 'IVE의 장원영이 올시다!!',
  })
  @IsString()
  public description: string;

  @ApiProperty({
    description: '동영상 URL',
    example: 'https://youtube.com/watch?v',
  })
  @IsString()
  public videoUrl: string;

  @ApiProperty({
    description: '이미지 이름',
    example: 'image.png',
  })
  @IsString()
  public imageName: string;
}

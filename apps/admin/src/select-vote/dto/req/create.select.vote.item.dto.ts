import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateSelectVoteItemDto {
  @ApiProperty({
    description: '번호',
    required: true,
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  public itemNum: number;

  @ApiProperty({
    description: '노출 번호',
    required: true,
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  public displayNum: number;

  @ApiProperty({
    description: '이름',
    required: true,
    example: '이효리',
  })
  @IsString()
  @IsNotEmpty()
  public name: string;

  @ApiProperty({
    description: '설명',
    required: true,
    example: '안녕하쇼! 이효리요!',
  })
  @IsString()
  @IsNotEmpty()
  public description: string;

  @ApiProperty({
    description: '동영상 URL',
    required: true,
    example: 'https://youtube.com/블라블라',
  })
  @IsString()
  @IsNotEmpty()
  public videoUrl: string;
}

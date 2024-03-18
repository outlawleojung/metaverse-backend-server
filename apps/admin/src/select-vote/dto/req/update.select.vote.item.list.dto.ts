import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsArray, IsOptional } from 'class-validator';

export class SelectVoteItemDisplay {
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
}

export class UpdateSelectVoteItemListDto {
  @ApiProperty({
    description: '투표 항목 리스트',
    required: false,
    type: SelectVoteItemDisplay,
    isArray: true,
  })
  @IsArray()
  @IsOptional()
  public voteItems: SelectVoteItemDisplay[] | null;

  @ApiProperty({
    description: '삭제 항목 리스트',
    example: [1, 2, 3],
    required: false,
    isArray: true,
  })
  @IsArray()
  @IsOptional()
  public deleteItems: number[] | null;
}

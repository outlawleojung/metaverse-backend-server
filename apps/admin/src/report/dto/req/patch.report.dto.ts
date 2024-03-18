import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class PatchReportDto {
  @ApiProperty({
    description: '상태 타입',
    example: 2,
  })
  @IsOptional()
  @IsNumber()
  public readonly stateType: number | null;

  @ApiProperty({
    description: '코멘트',
    required: false,
    example: '신고 대상자 최재쿠르를 영구 정지 해야됨!!',
  })
  @IsOptional()
  @IsNumber()
  public readonly comment: string | null;
}

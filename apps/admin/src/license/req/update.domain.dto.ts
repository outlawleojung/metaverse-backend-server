import { GetTableDto } from './../../common/dto/get.table.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateDomainDto extends GetTableDto {
  @ApiProperty({
    description: '소속',
    example: '서울대미대',
  })
  @IsString()
  @IsOptional()
  public readonly affiliation: string | null;

  @ApiProperty({
    description: '도메인 이름',
    required: true,
    example: 'seoul.com',
  })
  @IsString()
  @IsOptional()
  public readonly domainName: string | null;

  @ApiProperty({
    description: '담당자 이름',
    required: true,
    example: '김개똥',
  })
  @IsString()
  @IsOptional()
  public readonly chargeName: string | null;

  @ApiProperty({
    description: '담당자 직책',
    example: '회장',
  })
  @IsString()
  @IsOptional()
  public readonly chargePosition: string | null;

  @ApiProperty({
    description: '담당자 이메일',
    example: 'kkk@seoul.com',
  })
  @IsString()
  @IsOptional()
  public readonly chargeEmail: string | null;

  @ApiProperty({
    description: '담당자 전화번호',
    example: '01012345678',
  })
  @IsString()
  @IsOptional()
  public readonly chargePhone: string | null;
}

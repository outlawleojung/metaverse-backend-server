import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateDomainDto {
  @ApiProperty({
    description: '소속',
    required: true,
    example: '서울대미대',
  })
  @IsString()
  @IsNotEmpty()
  public readonly affiliation: string;

  @ApiProperty({
    description: '도메인 이름',
    required: true,
    example: 'seoul.com',
  })
  @IsString()
  @IsNotEmpty()
  public readonly domainName: string;

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

  @ApiProperty({
    description: '호출 타입',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  public readonly callType: number;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ChangeAdminInfoDto {
  @ApiProperty({
    description: '이름',
    required: false,
    example: '최재쿠르르',
  })
  @IsString()
  @IsOptional()
  public name: string;

  @ApiProperty({
    description: '전화번호',
    required: false,
    example: '01012345678',
  })
  @IsString()
  @IsOptional()
  public phoneNumber: string;

  @ApiProperty({
    description: '소속',
    required: false,
    example: '서버팀',
  })
  @IsString()
  @IsOptional()
  public department: string | null;

  @ApiProperty({
    description: '회사',
    required: false,
    example: '한컴프론티스',
  })
  @IsString()
  @IsOptional()
  public company: string | null;
}

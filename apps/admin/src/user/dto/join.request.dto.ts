import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class JoinRequestDto {
  @ApiProperty({
    description: '이메일',
    required: true,
    example: 'test@email.com',
  })
  @IsString()
  @IsNotEmpty()
  public email: string;

  @ApiProperty({
    description: '이름',
    required: true,
    example: '최재쿠르르',
  })
  @IsString()
  @IsNotEmpty()
  public name: string;

  @ApiProperty({
    description: '패스워드',
    required: true,
    example: '12354~@#',
  })
  @IsString()
  @IsNotEmpty()
  public password: string;

  @ApiProperty({
    description: '전화번호',
    required: true,
    example: '01012345678',
  })
  @IsString()
  @IsNotEmpty()
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

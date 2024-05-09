import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GetOthersRequestDto {
  @ApiProperty({
    example: 1,
    description: '찾기 타입',
  })
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value, 10))
  public type: number;

  @ApiProperty({
    example: '회원 아이디 OR 회원 코드',
    description: '회원 아이디 OR 회원 코드',
  })
  @IsNotEmpty()
  @IsString()
  public othersId: string;
}

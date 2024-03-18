import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class ChangeRoleTypeDto {
  @ApiProperty({
    name: 'roleType',
    description: '권한 타입',
    required: true,
    example: 1,
  })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  public readonly roleType: number;

  @ApiProperty({
    name: 'userId',
    description: '유저 아이디',
    required: true,
    example: 1,
  })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  public readonly userId: number;
}

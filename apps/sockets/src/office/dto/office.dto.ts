import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OfficeDto {
  @ApiProperty({
    example: '1238246',
    description: '룸코드',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  public readonly roomCode: number;
}

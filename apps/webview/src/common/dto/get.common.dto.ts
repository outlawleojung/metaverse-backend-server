import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class GetCommonDto {
  @IsString()
  @IsNotEmpty()
  public memberId: string;
}

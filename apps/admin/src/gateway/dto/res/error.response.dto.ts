import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export interface IErrorDto {
  error: number;
  errorMessage: string;
}

export class ErrorDto implements IErrorDto {
  @ApiProperty({
    example: 600,
    description: '에러 코드',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  error: number;

  @ApiProperty({
    example: 'NET_E_DB_FAILED',
    description: '에러 메세지',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  errorMessage: string;
}

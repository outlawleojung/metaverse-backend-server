import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SuccessDto {
  @ApiProperty({
    example: 200,
    description: '에러 코드',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  error: number;

  @ApiProperty({
    example: 'NET_E_SUCCESS',
    description: '에러 메세지',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  errorMessage: string;
}

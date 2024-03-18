import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class LoginAuthDto {
  @ApiProperty({
    example: 'NTkzYjgwMC05YjFlLTExZWQtOWJkMy05M2U3M2Q0Yz...',
    description: '로그인 토큰',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly loginToken: string;
}

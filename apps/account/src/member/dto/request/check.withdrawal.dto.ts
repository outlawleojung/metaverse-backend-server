import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CheckWidhDrawalDto {
  @ApiProperty({
    example: 1,
    description: '회원 유형',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  public readonly providerType: number;

  @ApiProperty({
    example: 'test2@email.com',
    description: '계정 토큰',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly accountToken: string;

  @ApiProperty({
    example: '12345',
    description: '패스워드',
    required: false,
  })
  @IsString()
  @IsOptional()
  public readonly password: string | null;
}

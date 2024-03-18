import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AutoLoginDto {
  @ApiProperty({
    example: '93b800-9b1e-11ed-9bd3....',
    description: '회원 아이디',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly memberId: string;

  @ApiProperty({
    example: '1',
    description: '회원 유형',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  public readonly providerType: number;
}

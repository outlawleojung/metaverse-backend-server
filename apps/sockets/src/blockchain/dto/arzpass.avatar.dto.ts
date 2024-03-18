import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ArzpassAvatarDto {
  @ApiProperty({
    example: '46024620-a5f8-11ed-93b3-ed21fce394b5',
    description: '멤버 아이디',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly memberId: string;
}

import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CheckRoomCodePassword {
  @ApiProperty({
    example: '1259348245',
    description: '룸 코드',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly roomCode: string;

  @ApiProperty({
    example: '1259348245',
    description: '패스워드',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly password: string;
}

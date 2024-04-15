import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWaitDto {
  @ApiProperty({
    example: '1259348245',
    description: '룸 코드',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  public readonly roomCode: string;
}

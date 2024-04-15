import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty } from 'class-validator';

export class UpdateStateTypeDto {
  @ApiProperty({
    example: 2,
    description: '마이룸 상태 타입',
  })
  @IsNumber()
  @IsNotEmpty()
  public myRoomStateType: number;
}

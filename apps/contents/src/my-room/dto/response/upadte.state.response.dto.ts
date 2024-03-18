import { IsNotEmpty, IsNumber } from 'class-validator';
import { SuccessDto } from './../../../dto/success.response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateStateTypeResponseDto extends SuccessDto {
  @ApiProperty({
    example: 2,
    description: '마이룸 상태 타입',
  })
  @IsNumber()
  @IsNotEmpty()
  public myRoomStateType: number;
}

import { SuccessDto } from './../../../dto/success.response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class GetFriendRoomIdResponseDto extends SuccessDto {
  @ApiProperty({
    example: 'abcdefghijklmn',
    required: true,
    description: '친구 접속 룸아이디',
  })
  public roomId: string;
}

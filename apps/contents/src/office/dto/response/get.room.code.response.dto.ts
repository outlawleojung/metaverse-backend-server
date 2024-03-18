import { ApiProperty } from '@nestjs/swagger';

export class GetRoomCodeResponseDto {
  @ApiProperty({
    example: '123051023',
    description: '룸 코드',
  })
  public roomCode: string;
}

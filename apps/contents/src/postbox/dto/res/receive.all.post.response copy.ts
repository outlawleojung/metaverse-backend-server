import { SuccessDto } from './../../../dto/success.response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ReceiveAllPostResponseDto extends SuccessDto {
  @ApiProperty({
    example: [1, 2],
    description: '우편 아이디',
  })
  public postboxIds: number[];

  @ApiProperty({
    example: [
      {
        itemType: 1,
        itemId: 230006,
        num: 1,
      },
      {
        itemType: 1,
        itemId: 230006,
        num: 2,
      },
    ],
    description: '받은 아이템 리스트',
  })
  public receivedItems: string[];
}

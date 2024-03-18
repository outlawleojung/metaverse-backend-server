import { SuccessDto } from '../../../dto/success.response.dto';
import { ApiProperty, OmitType } from '@nestjs/swagger';

export class GetMemberInfoResponseDto extends SuccessDto {
  @ApiProperty({
    example: [
      {
        itemId: 110001,
        num: 1,
        layerType: 1,
        x: 12,
        y: 8,
        rotation: 180,
      },
      {
        itemId: 110001,
        num: 2,
        layerType: 1,
        x: 22,
        y: 34,
        rotation: 32,
      },
      {
        itemId: 110002,
        num: 3,
        layerType: 2,
        x: 2,
        y: 10,
        rotation: 46,
      },
    ],
    description: '타인의 마이룸 리스트',
  })
  public othersRoomList: string;

  @ApiProperty({
    example: [
      {
        itemId: 110001,
        num: 1,
        uploadType: 1,
        imageName: 'image.png',
      },
      {
        itemId: 110001,
        num: 2,
        uploadType: 2,
        imageName: 'https://google.com/image.png',
      },
    ],
    description: '타인의 마이룸 액자 이미지 리스트',
  })
  public othersMyRoomFrameImages: string;
}

import { IsNotEmpty, IsNumber } from 'class-validator';
import { SuccessDto } from './../../../dto/success.response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UploadImageResponseDto extends SuccessDto {
  @ApiProperty({
    example: [
      {
        itemId: 211001,
        num: 1,
        uploadType: 1,
        imageName: 'Jenny.jpg',
      },
      {
        itemId: 211003,
        num: 2,
        uploadType: 1,
        imageName: 'Jenna.jpg',
      },
    ],
    description: '마이룸 액자 이미지',
  })
  @IsNumber()
  @IsNotEmpty()
  public frameImages: string;
}

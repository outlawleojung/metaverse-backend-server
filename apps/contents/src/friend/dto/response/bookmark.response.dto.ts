import { SuccessDto } from '../../../dto/success.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { FriendMemberDefault } from './find.friend.response.dto';

export class BookmarkResponseDto extends SuccessDto {
  @ApiProperty({
    example: 1,
    description: '즐겨찾기 여부',
    required: true,
  })
  public bookmark: number;

  @ApiProperty({
    example: '2022-09-27 13:48:25',
    description: '즐겨찾기 일시',
    required: false,
  })
  public bookmarkedAt: Date;
}

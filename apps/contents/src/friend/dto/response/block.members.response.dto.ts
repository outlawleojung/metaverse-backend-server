import { SuccessDto } from '../../../dto/success.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { FriendMemberDefault } from './find.friend.response.dto';

export class BlockMembersResponseDto extends SuccessDto {
  @ApiProperty({
    type: FriendMemberDefault,
    isArray: true,
    description: '차단 목록',
  })
  public blockMembers: FriendMemberDefault[];
}

import { ApiProperty } from '@nestjs/swagger';
import { SuccessDto } from '../../dto/success.response.dto';
import { ValidateIf } from 'class-validator';

export class OhtersMemberData {
  @ApiProperty({
    example: 'DGK44OB04',
    description: '타인의 회원 코드',
    required: true,
  })
  public memberCode: string;

  @ApiProperty({
    example: 2,
    description: '마이룸 상태 타입',
  })
  public myRoomStateType: number;

  @ApiProperty({
    example: '한쏘주',
    description: '닉네임',
  })
  @ValidateIf((object, value) => value !== null)
  public nickname: string | null;

  @ApiProperty({
    example: '상태 썩음',
    description: '타인의 상태 메세지',
  })
  @ValidateIf((object, value) => value !== null)
  public stateMessage: string | null;

  @ApiProperty({
    example: {
      '1': 310002,
      '4': 340006,
      '6': 360010,
    },
    description: '아바타 정보',
  })
  public avatarInfos: string;

  @ApiProperty({
    example: {
      templateId: 1,
      name: '한쏘맥',
      phone: '010-1234-5678',
      email: 'test@email.com',
      addr: null,
      fax: null,
      job: '백수',
      position: null,
      intro: null,
    },
    description: '비즈니스 명함 정보',
  })
  public bizCard: string;
}
export class GetOthersResponsesDto extends SuccessDto {
  @ApiProperty({
    type: OhtersMemberData,
    description: '타인 회원 정보',
  })
  ohtersMember: OhtersMemberData;
}

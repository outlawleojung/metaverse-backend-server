import { ApiProperty } from '@nestjs/swagger';

import {
  ServerType,
  OsType,
  ProviderType,
  OfficeGradeType,
} from '@libs/entity';

export class Member {
  @ApiProperty({
    example: 'dk39gk-2gqph-....',
    description: 'memberId',
  })
  public memberId: number;

  @ApiProperty({
    example: 'ETEFAVGOPA',
    description: 'memberCode',
  })
  public memberCode: string;

  @ApiProperty({
    example: '내 별명 입니다.',
    description: 'nickname',
  })
  public nickname: string;

  @ApiProperty({
    example: 1,
    description: 'officeGradeType',
  })
  public officeGradeType: number;

  @ApiProperty({
    example: 1,
    description: 'providerType',
  })
  public providerType: number;

  @ApiProperty({
    example: '2023-02-02 15:42:21',
    description: '생성 일시',
  })
  public createdAt: Date;

  @ApiProperty({
    type: OsType,
    description: 'ProviderType',
  })
  public ProviderType: ProviderType;

  @ApiProperty({
    type: ServerType,
    description: 'OfficeGradeType',
  })
  public OfficeGradeType: OfficeGradeType;
}

export class MemberList {
  @ApiProperty({
    type: Member,
    isArray: true,
    description: '리스트',
  })
  public rows: Member[];

  @ApiProperty({
    example: 23,
    description: '총 갯수',
  })
  public count: number;
}

export class MemberListResponseDto {
  @ApiProperty({
    type: MemberList,
    description: '회원 리스트',
  })
  public memberList: MemberList;
}

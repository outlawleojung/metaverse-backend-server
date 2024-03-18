import { ApiProperty } from '@nestjs/swagger';

export class MemberInfoResponseDto {
  @ApiProperty({
    example: {
      memberId: '6a696270-5fc9...',
      memberCode: '59VJ9B9FZT',
      email: 'email@email.com',
      officeGradeType: 1,
      firstProviderType: 1,
      loginedAt: '2022-11-09T00:57:00.000Z',
      createdAt: '2022-11-09T00:57:00.000Z',
      ProviderType: {
        name: '아즈메타',
      },
      OfficeGradeType: {
        name: '일반',
      },
      MemberAccounts: [
        {
          providerType: 1,
        },
        {
          providerType: 2,
        },
      ],
    },
    description: '회원 리스트',
  })
  public memberInfo: string;
}

import { ApiProperty } from '@nestjs/swagger';

export class GetLicenseResponseDto {
  @ApiProperty({
    description: '전체 라이선스 리스트',
    example: [
      {
        licenseSerial: '1521-RLFC-LMN8',
        affiliation: '댄스동호회',
        licenseType: 1,
        licenseName: '댄스댄스_2023',
        startedAt: '2023-03-22T15:00:00.000Z',
        endedAt: '2024-02-22T15:00:00.000Z',
        memberRegiseteredAt: '2023-03-07T04:04:53.000Z',
        memberCode: '1ETFXGWFOC1C',
        authEmail: 'test@email.com',
        createdAt: '2023-03-06T12:08:06.000Z',
        adminName: '정민영',
        stateType: 2,
        stateTypeName: '사용',
      },
      {
        licenseSerial: '5K04-QMXT-WMHV',
        affiliation: '댄스동호회',
        licenseType: 1,
        licenseName: '댄스댄스_2023',
        startedAt: '2023-03-22T15:00:00.000Z',
        endedAt: '2024-02-22T15:00:00.000Z',
        memberRegiseteredAt: null,
        memberCode: null,
        authEmail: null,
        createdAt: '2023-03-06T12:08:06.000Z',
        adminName: '정민영',
        stateType: 1,
        stateTypeName: '미사용',
      },
    ],
  })
  public readonly rows: string;

  @ApiProperty({
    description: '리스트 개수',
    example: 12,
  })
  public readonly count: number;
}

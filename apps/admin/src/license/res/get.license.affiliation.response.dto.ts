import { ApiProperty } from '@nestjs/swagger';

export class GetLicenseAffiliationResponseDto {
  @ApiProperty({
    description: '전체 라이선스 리스트',
    example: [
      {
        licenseSerial: '1521-RLFC-LMN8',
        licenseName: '댄스댄스_2023',
        affiliation: '댄스동호회맞냐!!',
        licenseType: 1,
        startedAt: '2023-02-22T15:00:00.000Z',
        endedAt: '2024-02-22T15:00:00.000Z',
        memberCode: '1ETFXGWFOC1C',
        registerdAt: '2023-03-07T04:04:53.000Z',
        email: 'test@email.com',
        stateTypeName: '사용중',
      },
      {
        licenseSerial: '5K04-QMXT-WMHV',
        licenseName: '댄스댄스_2023',
        affiliation: '댄스동호회맞냐!!',
        licenseType: 1,
        startedAt: '2023-02-22T15:00:00.000Z',
        endedAt: '2024-02-22T15:00:00.000Z',
        memberCode: null,
        registerdAt: null,
        email: null,
        stateTypeName: '사용중',
      },
      {
        licenseSerial: '5RD7-5XKP-JBW2',
        licenseName: '댄스댄스_2023',
        affiliation: '댄스동호회맞냐!!',
        licenseType: 1,
        startedAt: '2023-02-22T15:00:00.000Z',
        endedAt: '2024-02-22T15:00:00.000Z',
        memberCode: null,
        registerdAt: null,
        email: null,
        stateTypeName: '사용중',
      },
    ],
  })
  public readonly licenses: string;
}

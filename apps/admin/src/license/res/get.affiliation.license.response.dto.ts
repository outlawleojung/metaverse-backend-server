import { ApiProperty } from '@nestjs/swagger';

export class GetLicenseAffilicationResponseDto {
  @ApiProperty({
    description: '전체 라이선스 리스트',
    example: [
      {
        id: 3,
        licenseName: '댄스댄스_2023',
        affiliation: '댄스동호회',
        licenseType: 1,
        startedAt: '2023-02-22T15:00:00.000Z',
        endedAt: '2024-02-22T15:00:00.000Z',
        expirationDay: null,
        issueCount: 20,
        useCount: 1,
        stateType: 2,
        stateTypeName: '사용가능',
        doaminname: 'hancom.com',
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

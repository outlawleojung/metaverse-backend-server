import { ApiProperty } from '@nestjs/swagger';

export class GetReportListResponseDto {
  @ApiProperty({
    description: '신고 리스트',
    example: [
      {
        m_reportType: 1,
        id: 96,
        reportedAt: '2023-02-22T15:00:00.000Z',
        stateType: 1,
        stateTypeName: '신고 접수',
        reportTypeName: '비매너 행위',
        reasonTypeName: '채팅 도배 · 욕설',
        completedAt: null,
        adminName: null,
      },
    ],
  })
  public readonly rows: string;

  @ApiProperty({
    description: '리스트 개수',
    example: 12,
  })
  public readonly count: number;

  @ApiProperty({
    description: '신고 대상자 정보',
    example: {
      receiptCount: {
        count: '1',
      },
      completeCount: {
        count: '0',
      },
      requestCount: {
        count: '0',
      },
    },
  })
  public readonly stateInfo: string;
}

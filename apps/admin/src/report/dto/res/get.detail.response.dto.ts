import { ApiProperty } from '@nestjs/swagger';

export class GetDetailResponseDto {
  @ApiProperty({
    description: '신고 상세',
    example: {
      id: 96,
      reportedAt: '2023-02-22T15:00:00.000Z',
      reportType: 1,
      reportTypeName: '비매너 행위',
      reasonType: 1,
      reasonTypeName: '채팅 도배 · 욕설',
      targetNickname: '이거슨닉네임',
      reportMemberCode: 'F0EQ8EKNNA0K',
      repportNickname: '연봉협상가',
      content: '괴롭혔음',
      images: '["acabf23f-9f4b-4b31-8edc-51bf71ed2f7d.jpeg"]',
      stateType: 1,
      comment: null,
    },
  })
  public readonly report: string;

  @ApiProperty({
    description: '신고 대상자 정보',
    example: {
      memberCode: 'F0EQ8EKNNA0K',
      nickname: '이거슨닉네임',
      count: '2',
      createdAt: '2022-12-27T02:03:31.000Z',
      loginedAt: '2023-01-27T05:16:26.000Z',
    },
  })
  public readonly targetMember: string;
}

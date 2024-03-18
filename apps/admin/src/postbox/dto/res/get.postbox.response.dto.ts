import { ApiProperty } from '@nestjs/swagger';

export class GetPostboxResponseDTO {
  @ApiProperty({
    description: '우편함 상세 정보',
    example: {
      postboxes: {
        postboxId: 2,
        postalType: 2,
        postalTypeName: '이벤트',
        postalState: 2,
        postalStateName: '발송 완료',
        subject: '테스트 발송2',
        summary: '테스트 발송 하기 2',
        contents: '테스트 발송 발송 2',
        period: 2,
        adminName: '손재명',
        createdAt: '2023-05-09T04:47:17.000Z',
        sendedAt: '2023-05-09T04:47:16.000Z',
        postboxAppend: {
          appendType: 1,
          appendTypeName: '아이템',
          appendValue: 220001,
          count: 1,
          thumbnail: 'b_t_thum_floorstand',
          name: '심플 조명',
        },
      },
    },
  })
  public readonly postbox: string;
}

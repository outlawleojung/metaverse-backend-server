import { ApiProperty } from '@nestjs/swagger';

export class GetPaymentStateTypeListResponseDto {
  @ApiProperty({
    description: '결제 상태 로그 리스트',
    required: true,
    example: [
      {
        type: 1,
        name: '결제 완료',
      },
      {
        type: 2,
        name: '결제 대기',
      },
      {
        type: 3,
        name: '결제 실패',
      },
      {
        type: 4,
        name: '환불 완료',
      },
      {
        type: 5,
        name: '환불 완료(스토어)\r\n',
      },
      {
        type: 6,
        name: '환불 대기\r\n',
      },
    ],
  })
  public readonly paymentList: string;
}

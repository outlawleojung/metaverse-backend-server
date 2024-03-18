import { ApiProperty } from '@nestjs/swagger';

export class GetPaymentStateResponseDto {
  @ApiProperty({
    description: '결제 상태 로그 리스트',
    required: true,
    example: [
      {
        orderId: 'FggSaaGranbelNscpZFrZ',
        paymentStateType: 1,
        paymentCreateAt: '2023-06-12T06:56:33.000Z',
        paymentDeleteAt: '2023-06-12T06:56:33.000Z',
        vBankCreateAt: '2023-06-12T06:56:33.000Z',
        vBankDeleteAt: '2023-06-12T06:56:33.000Z',
        createdAt: '2023-06-12T06:56:33.000Z',
        updatedAt: '2023-06-12T06:56:33.000Z',
      },
    ],
  })
  public readonly paymentStateList: string;
}

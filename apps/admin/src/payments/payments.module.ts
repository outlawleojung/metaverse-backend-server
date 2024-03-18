import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentList, PaymentStateLog, PaymentStateType } from '@libs/entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentList, PaymentStateLog, PaymentStateType]),
  ],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}

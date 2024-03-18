import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member, PaymentList } from '@libs/entity';

@Module({
  imports: [TypeOrmModule.forFeature([Member, PaymentList])],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}

import { Inject, Injectable } from '@nestjs/common';
import { UpdatePaymentStateDto } from './dto/req/update.paymentState.dto';
import { PaymentList, PaymentStateLog, PaymentStateType } from '@libs/entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GetPaymentStateDto } from './dto/req/get.paymentStateList.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(PaymentList)
    private readonly paymentlistRepository: Repository<PaymentList>,
    @InjectRepository(PaymentStateLog)
    private readonly paymentStateLogRepository: Repository<PaymentStateLog>,
    @InjectRepository(PaymentStateType)
    private readonly paymentStateTypeRepository: Repository<PaymentStateType>,
    @Inject(DataSource) private readonly dataSource: DataSource,
  ) {}

  async getPaymenTypetList() {
    const result = await this.paymentStateTypeRepository.find();
    return { result };
  }

  async getPaymentList() {
    const result = await this.paymentlistRepository.find();
    return { result };
  }

  async getPaymentStatus(getPaymentStateDto: GetPaymentStateDto) {
    const orderId = getPaymentStateDto.orderId;

    const result = await this.paymentStateLogRepository.find({
      where: { orderId: orderId },
    });
    return { result };
  }

  async changePaymentState(updatePaymentStateDto: UpdatePaymentStateDto) {
    const orderId = updatePaymentStateDto.orderId;
    const paymentStateType = updatePaymentStateDto.paymentStateType;

    const isOrder = await this.paymentlistRepository.findOne({
      where: { orderId },
    });

    if (!isOrder) {
      throw new Error('주문 번호가 존재하지 않습니다.');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.getRepository(PaymentList).update(
        {
          orderId: orderId,
        },
        {
          paymentStateType: paymentStateType,
        },
      );

      await queryRunner.manager.getRepository(PaymentStateLog).insert({
        orderId: orderId,
        paymentStateType: paymentStateType,
      });

      await queryRunner.commitTransaction();

      const result = await this.paymentStateLogRepository.find({
        where: { orderId },
      });
      return { result };
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}

import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('payment_state_log')
export class PaymentStateLog {
  @PrimaryColumn('varchar', { name: 'orderId', length: 100 })
  orderId: string;

  @Column('int', { name: 'paymentStateType' })
  paymentStateType: number;

  @Column('datetime', { name: 'paymentCreateAt', nullable: true })
  paymentCreateAt: Date | null;

  @Column('datetime', { name: 'paymentDeleteAt', nullable: true })
  paymentDeleteAt: Date | null;

  @Column('datetime', { name: 'vBankCreateAt', nullable: true })
  vBankCreateAt: Date | null;

  @Column('datetime', { name: 'vBankDeleteAt', nullable: true })
  vBankDeleteAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

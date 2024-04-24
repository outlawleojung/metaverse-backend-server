import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('payment_state_log')
export class PaymentStateLog {
  @PrimaryColumn('varchar', { length: 100 })
  orderId: string;

  @Column('int')
  paymentStateType: number;

  @Column('datetime', { nullable: true })
  paymentCreateAt: Date | null;

  @Column('datetime', { nullable: true })
  paymentDeleteAt: Date | null;

  @Column('datetime', { nullable: true })
  vBankCreateAt: Date | null;

  @Column('datetime', { nullable: true })
  vBankDeleteAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

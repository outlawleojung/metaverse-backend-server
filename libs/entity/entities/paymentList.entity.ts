import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('payment_list')
export class PaymentList {
  @PrimaryColumn('varchar', { length: 100 })
  orderId: string;

  @Column('varchar', { length: 100 })
  orderName: string;

  @Column('varchar', { length: 100 })
  memberCode: string;

  @Column('varchar', { length: 100 })
  nickName: string;

  @Column('int')
  productId: number;

  @Column('int')
  count: number;

  @Column('int')
  price: number;

  @Column('int')
  storeType: number;

  @Column('json')
  paymentsData: string;

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

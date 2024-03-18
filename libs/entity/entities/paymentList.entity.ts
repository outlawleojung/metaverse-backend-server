import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('payment_list')
export class PaymentList {
  @PrimaryColumn('varchar', { name: 'orderId', length: 100 })
  orderId: string;

  @Column('varchar', { name: 'orderName', length: 100 })
  orderName: string;

  @Column('varchar', { name: 'memberCode', length: 100 })
  memberCode: string;

  @Column('varchar', { name: 'nickName', length: 100 })
  nickName: string;

  @Column('int', { name: 'productId' })
  productId: number;

  @Column('int', { name: 'count' })
  count: number;

  @Column('int', { name: 'price' })
  price: number;

  @Column('int', { name: 'storeType' })
  storeType: number;

  @Column('json', { name: 'paymentsData' })
  paymentsData: string;

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
  // @OneToMany(() => VoteInfo, (voteinfo) => voteinfo.VoteResType)
  // VoteInfos: VoteInfo[];
}

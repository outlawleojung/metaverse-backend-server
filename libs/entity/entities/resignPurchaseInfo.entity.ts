import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('resign_purchase_info')
export class ResignPurchaseInfo {
  @PrimaryColumn('varchar', { name: 'orderId', length: 100 })
  orderId: string;

  @Column('varchar', { name: 'memberId', length: 100 })
  memberId: string;

  @Column('datetime', { name: 'purchasedAt' })
  purchasedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

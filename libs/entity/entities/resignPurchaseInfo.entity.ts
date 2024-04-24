import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('resign_purchase_info')
export class ResignPurchaseInfo {
  @PrimaryColumn('varchar', { length: 100 })
  orderId: string;

  @Column('varchar', { length: 100 })
  memberId: string;

  @Column('datetime')
  purchasedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Member } from './member.entity';
import { PaymentProductManager } from './paymentProductManager.entity';

@Index('memberId', ['memberId'], {})
@Index('productId', ['productId'], {})
@Entity('member_purchase_item')
export class MemberPurchaseItem {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'memberId', length: 100 })
  memberId: string;

  @Column('int', { name: 'productId' })
  productId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Member, (member) => member.MemberPurchaseItems, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'memberId', referencedColumnName: 'memberId' }])
  Member: Member;

  @ManyToOne(() => PaymentProductManager, (manager) => manager.MemberPurchaseItems, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'productId', referencedColumnName: 'id' }])
  PaymentProductManager: PaymentProductManager;
}

import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Member } from './member.entity';
import { PaymentProductManager } from './paymentProductManager.entity';
import { BaseModelEntity } from './baseModelEntity.entity';

@Index('memberId', ['memberId'], {})
@Index('productId', ['productId'], {})
@Entity('member_purchase_item')
export class MemberPurchaseItem extends BaseModelEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column('uuid')
  memberId: string;

  @Column('int', { name: 'productId' })
  productId: number;

  @ManyToOne(() => Member, (member) => member.MemberPurchaseItems, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'memberId' })
  Member: Member;

  @ManyToOne(
    () => PaymentProductManager,
    (manager) => manager.MemberPurchaseItems,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'productId' })
  PaymentProductManager: PaymentProductManager;
}

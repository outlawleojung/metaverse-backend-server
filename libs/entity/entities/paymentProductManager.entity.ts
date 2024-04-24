import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { MoneyType } from './moneyType.entity';
import { OfficeProductItem } from './officeProductItem.entity';
import { MemberPurchaseItem } from './memberPurchaseItem.entity';

@Index('moneyType', ['moneyType'], {})
@Entity('payment_product_manager')
export class PaymentProductManager {
  @PrimaryColumn({ type: 'int' })
  id: number;

  @Column('int')
  moneyType: number;

  @Column('int')
  price: number;

  @Column('int')
  purchaseLimit: number;

  @OneToMany(
    () => OfficeProductItem,
    (product) => product.PaymentProductManager,
  )
  OfficeProductItems: OfficeProductItem[];

  @OneToMany(() => MemberPurchaseItem, (item) => item.PaymentProductManager)
  MemberPurchaseItems: MemberPurchaseItem[];

  @ManyToOne(() => MoneyType, (type) => type.PaymentProductManagers, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'moneyType' })
  MoneyType: MoneyType;
}

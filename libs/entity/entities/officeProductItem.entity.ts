import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { PaymentProductManager } from './paymentProductManager.entity';
import { Localization } from './localization.entity';
import { OfficeGradeType } from './officeGradeType.entity';

@Index('name', ['name'], {})
@Index('officeGradeType', ['officeGradeType'], {})
@Entity('office_product_item')
export class OfficeProductItem {
  @PrimaryColumn({ type: 'int' })
  productId: number;

  @Column('varchar', { length: 32 })
  name: string;

  @Column('int')
  officeGradeType: number;

  @Column('int')
  period: number;

  @ManyToOne(
    () => PaymentProductManager,
    (manager) => manager.OfficeProductItems,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'productId' })
  PaymentProductManager: PaymentProductManager;

  @ManyToOne(
    () => Localization,
    (localization) => localization.OfficeProductItems,
    {
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'name' })
  LocalizationName: Localization;

  @ManyToOne(() => OfficeGradeType, (type) => type.OfficeProductItems, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'officeGradeType' })
  OfficeGradeType: OfficeGradeType;
}

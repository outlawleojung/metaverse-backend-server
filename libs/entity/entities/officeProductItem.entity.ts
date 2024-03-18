import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { PaymentProductManager } from './paymentProductManager.entity';
import { Localization } from './localization.entity';
import { OfficeGradeType } from './officeGradeType.entity';

@Index('name', ['name'], {})
@Index('officeGradeType', ['officeGradeType'], {})
@Entity('office_product_item')
export class OfficeProductItem {
  @PrimaryColumn({ type: 'int', name: 'productId' })
  productId: number;

  @Column('varchar', { name: 'name', length: 32 })
  name: string;

  @Column('int', { name: 'officeGradeType' })
  officeGradeType: number;

  @Column('int', { name: 'period' })
  period: number;

  @ManyToOne(() => PaymentProductManager, (manager) => manager.OfficeProductItems, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'productId', referencedColumnName: 'id' }])
  PaymentProductManager: PaymentProductManager;

  @ManyToOne(() => Localization, (localization) => localization.OfficeProductItems, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'name', referencedColumnName: 'id' }])
  LocalizationName: Localization;

  @ManyToOne(() => OfficeGradeType, (type) => type.OfficeProductItems, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'officeGradeType', referencedColumnName: 'type' }])
  OfficeGradeType: OfficeGradeType;
}

import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { MoneyType } from './moneyType.entity';
import { PostalEffectType } from './postalEffectType.entity';

@Index('postalEffectType', ['postalEffectType'], {})
@Entity('postal_money_property')
export class PostalMoneyProperty {
  @PrimaryColumn('int', { name: 'moneyType' })
  moneyType: number | null;

  @Column('int', { name: 'postalEffectType' })
  postalEffectType: number;

  @Column('varchar', { name: 'effectResource', length: 32 })
  effectResource: string;

  @ManyToOne(() => MoneyType, (type) => type.PostalMoneyProperties, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'moneyType', referencedColumnName: 'type' }])
  MoneyType: MoneyType;

  @ManyToOne(() => PostalEffectType, (type) => type.PostalMoneyProperties, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'postalEffectType', referencedColumnName: 'type' }])
  PostalEffectType: PostalEffectType;
}

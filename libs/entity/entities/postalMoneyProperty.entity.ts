import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { MoneyType } from './moneyType.entity';
import { PostalEffectType } from './postalEffectType.entity';

@Index('postalEffectType', ['postalEffectType'], {})
@Entity('postal_money_property')
export class PostalMoneyProperty {
  @PrimaryColumn('int')
  moneyType: number;

  @Column('int')
  postalEffectType: number;

  @Column('varchar', { length: 32 })
  effectResource: string;

  @ManyToOne(() => MoneyType, (type) => type.PostalMoneyProperties, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'moneyType' })
  MoneyType: MoneyType;

  @ManyToOne(() => PostalEffectType, (type) => type.PostalMoneyProperties, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'postalEffectType' })
  PostalEffectType: PostalEffectType;
}

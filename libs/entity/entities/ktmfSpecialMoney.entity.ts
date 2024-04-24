import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { KtmfPassTierRatingType } from './ktmfPassTierRatingType.entity';
import { MoneyType } from './moneyType.entity';

@Entity('ktmf_special_money')
export class KtmfSpecialMoney {
  @PrimaryColumn('int')
  ratingType: number;

  @Column('int')
  moneyType: number;

  @Column('int')
  rewardCount: number;

  @ManyToOne(() => KtmfPassTierRatingType, (type) => type.KtmfSpecialMoney, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'ratingType' })
  KtmfPassTierRatingType: KtmfPassTierRatingType;

  @ManyToOne(() => MoneyType, (type) => type.KtmfSpecialMoney, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'moneyType' })
  MoneyType: MoneyType;
}

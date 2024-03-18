import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { KtmfPassTierRatingType } from './ktmfPassTierRatingType.entity';
import { MoneyType } from './moneyType.entity';

@Entity('ktmf_special_money')
export class KtmfSpecialMoney {
  @PrimaryColumn('int', { name: 'ratingType' })
  ratingType: number;

  @Column('int', { name: 'moneyType' })
  moneyType: number;

  @Column('int', { name: 'rewardCount' })
  rewardCount: number;

  @ManyToOne(() => KtmfPassTierRatingType, (type) => type.KtmfSpecialMoney, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'ratingType', referencedColumnName: 'type' }])
  KtmfPassTierRatingType: KtmfPassTierRatingType;

  @ManyToOne(() => MoneyType, (type) => type.KtmfSpecialMoney, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'moneyType', referencedColumnName: 'type' }])
  MoneyType: MoneyType;
}

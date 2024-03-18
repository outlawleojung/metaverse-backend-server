import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { KtmfSpecialMoney } from './ktmfSpecialMoney.entity';
import { KtmfNftToken } from './ktmfNftToken.entiry';

@Entity('ktmf_pass_tier_rating_type')
export class KtmfPassTierRatingType {
  @PrimaryColumn('int', { name: 'type' })
  type: number;

  @Column('varchar', { name: 'name', length: 20 })
  name: string;

  @OneToMany(() => KtmfSpecialMoney, (param) => param.KtmfPassTierRatingType)
  KtmfSpecialMoney: KtmfSpecialMoney[];

  @OneToMany(() => KtmfNftToken, (param) => param.KtmfPassTierRatingType)
  KtmfNftTokens: KtmfNftToken[];
}

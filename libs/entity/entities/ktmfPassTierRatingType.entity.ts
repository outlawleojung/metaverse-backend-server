import { Entity, OneToMany } from 'typeorm';
import { KtmfSpecialMoney } from './ktmfSpecialMoney.entity';
import { KtmfNftToken } from './ktmfNftToken.entiry';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('ktmf_pass_tier_rating_type')
export class KtmfPassTierRatingType extends BaseTypeEntity {
  @OneToMany(() => KtmfSpecialMoney, (param) => param.KtmfPassTierRatingType)
  KtmfSpecialMoney: KtmfSpecialMoney[];

  @OneToMany(() => KtmfNftToken, (param) => param.KtmfPassTierRatingType)
  KtmfNftTokens: KtmfNftToken[];
}

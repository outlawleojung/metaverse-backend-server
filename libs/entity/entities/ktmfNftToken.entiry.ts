import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { Item } from './item.entity';
import { KtmfSpecialItem } from './ktmfSpecialItem.entiry';
import { KtmfPassTierRatingType } from './ktmfPassTierRatingType.entity';

@Index('costumeId', ['costumeId'], {})
@Index('tokenId', ['tokenId'], {})
@Entity('ktmf_nft_token')
export class KtmfNftToken {
  @PrimaryColumn('int', { name: 'costumeId' })
  costumeId: number;

  @Column('varchar', { name: 'tokenId', length: 128 })
  tokenId: string;

  @Column('int', { name: 'ratingType' })
  ratingType: string;

  @OneToOne(() => Item, (item) => item.KtmfNftTokens, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'costumeId', referencedColumnName: 'id' }])
  Item: Item;

  @ManyToOne(() => KtmfPassTierRatingType, (type) => type.KtmfNftTokens, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'ratingType', referencedColumnName: 'type' }])
  KtmfPassTierRatingType: KtmfPassTierRatingType;

  @OneToMany(() => KtmfSpecialItem, (param) => param.KtmfNftToken)
  KtmfSpecialItems: KtmfSpecialItem[];
}

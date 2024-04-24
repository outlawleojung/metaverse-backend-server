import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Item } from './item.entity';
import { KtmfSpecialItem } from './ktmfSpecialItem.entiry';
import { KtmfPassTierRatingType } from './ktmfPassTierRatingType.entity';

@Index('costumeId', ['costumeId'], {})
@Index('tokenId', ['tokenId'], {})
@Entity('ktmf_nft_token')
export class KtmfNftToken {
  @PrimaryColumn('int')
  costumeId: number;

  @Column('varchar', { length: 128 })
  tokenId: string;

  @Column('int')
  ratingType: string;

  @OneToOne(() => Item, (item) => item.KtmfNftTokens, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'costumeId' })
  Item: Item;

  @ManyToOne(() => KtmfPassTierRatingType, (type) => type.KtmfNftTokens, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'ratingType' })
  KtmfPassTierRatingType: KtmfPassTierRatingType;

  @OneToMany(() => KtmfSpecialItem, (param) => param.KtmfNftToken)
  KtmfSpecialItems: KtmfSpecialItem[];
}

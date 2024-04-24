import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Item } from './item.entity';
import { KtmfNftToken } from './ktmfNftToken.entiry';

@Index('costumeId', ['costumeId'], {})
@Index('partsId', ['partsId'], {})
@Entity('ktmf_special_item')
export class KtmfSpecialItem {
  @PrimaryColumn('int')
  costumeId: number;

  @PrimaryColumn('int')
  partsId: number;

  @OneToOne(() => KtmfNftToken, (item) => item.KtmfSpecialItems, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'costumeId' })
  KtmfNftToken: KtmfNftToken;

  @OneToOne(() => Item, (item) => item.KtmfSpecialItems, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'partsId' })
  Item: Item;
}

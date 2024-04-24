import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { ItemType } from './itemType.entity';
import { CategoryType } from './categoryType.entity';
import { PostalEffectType } from './postalEffectType.entity';

@Index('categoryType', ['categoryType'], {})
@Index('postalEffectType', ['postalEffectType'], {})
@Entity('postal_item_property')
export class PostalItemProperty {
  @PrimaryColumn('int')
  itemType: number;

  @PrimaryColumn('int')
  categoryType: number;

  @Column('int')
  postalEffectType: number;

  @Column('varchar', { length: 32 })
  effectResource: string;

  @ManyToOne(() => ItemType, (type) => type.PostalItemProperties, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'itemType' })
  ItemType: ItemType;

  @ManyToOne(() => CategoryType, (type) => type.PostalItemProperties, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'categoryType' })
  CategoryType: CategoryType;

  @ManyToOne(() => PostalEffectType, (type) => type.PostalItemProperties, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'postalEffectType' })
  PostalEffectType: PostalEffectType;
}

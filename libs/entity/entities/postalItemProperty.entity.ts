import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { ItemType } from './itemType.entity';
import { CategoryType } from './categoryType.entity';
import { PostalEffectType } from './postalEffectType.entity';

@Index('categoryType', ['categoryType'], {})
@Index('postalEffectType', ['postalEffectType'], {})
@Entity('postal_item_property')
export class PostalItemProperty {
  @PrimaryColumn('int', { name: 'itemType' })
  itemType: number;

  @PrimaryColumn('int', { name: 'categoryType' })
  categoryType: number;

  @Column('int', { name: 'postalEffectType' })
  postalEffectType: number;

  @Column('varchar', { name: 'effectResource', length: 32 })
  effectResource: string;

  @ManyToOne(() => ItemType, (type) => type.PostalItemProperties, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'itemType', referencedColumnName: 'type' }])
  ItemType: ItemType;

  @ManyToOne(() => CategoryType, (type) => type.PostalItemProperties, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'categoryType', referencedColumnName: 'type' }])
  CategoryType: CategoryType;

  @ManyToOne(() => PostalEffectType, (type) => type.PostalItemProperties, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'postalEffectType', referencedColumnName: 'type' }])
  PostalEffectType: PostalEffectType;
}

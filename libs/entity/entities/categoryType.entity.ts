import { Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Item } from './item.entity';
import { Localization } from './localization.entity';
import { PostalItemProperty } from './postalItemProperty.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Index('name', ['name'], {})
@Entity('category_type')
export class CategoryType extends BaseTypeEntity {
  @ManyToOne(() => Localization, (localization) => localization.CategoryTypes, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'name' })
  LocalizationName: Localization;

  @OneToMany(() => Item, (item) => item.CategoryType)
  Items: Item[];

  @OneToMany(() => PostalItemProperty, (property) => property.CategoryType)
  PostalItemProperties: PostalItemProperty[];
}

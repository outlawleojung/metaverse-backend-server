import { Entity, OneToMany } from 'typeorm';
import { PostalItemProperty } from './postalItemProperty.entity';
import { PostalMoneyProperty } from './postalMoneyProperty.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('postal_effect_type')
export class PostalEffectType extends BaseTypeEntity {
  @OneToMany(() => PostalItemProperty, (property) => property.PostalEffectType)
  PostalItemProperties: PostalItemProperty[];

  @OneToMany(() => PostalMoneyProperty, (property) => property.PostalEffectType)
  PostalMoneyProperties: PostalMoneyProperty[];
}

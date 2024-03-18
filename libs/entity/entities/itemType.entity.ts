import { Entity, OneToMany } from 'typeorm';
import { Item } from './item.entity';
import { PostalItemProperty } from './postalItemProperty.entity';
import { MemberAvatarPartsItemInven } from './memberAvatarPartsItemInven.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('item_type')
export class ItemType extends BaseTypeEntity {
  @OneToMany(() => Item, (item) => item.ItemType)
  Items: Item[];

  @OneToMany(() => MemberAvatarPartsItemInven, (inven) => inven.ItemType)
  MemberAvatarPartsItemInvens: MemberAvatarPartsItemInven[];

  @OneToMany(() => PostalItemProperty, (property) => property.ItemType)
  PostalItemProperties: PostalItemProperty[];
}

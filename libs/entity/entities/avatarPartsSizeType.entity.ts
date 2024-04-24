import { Entity, OneToMany } from 'typeorm';
import { CommerceZoneItem } from './commerceZoneItem.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('avatar_parts_size_type')
export class AvatarPartsSizeType extends BaseTypeEntity {
  @OneToMany(() => CommerceZoneItem, (item) => item.AvatarPartsGroupType)
  CommerceZoneItems: CommerceZoneItem[];
}

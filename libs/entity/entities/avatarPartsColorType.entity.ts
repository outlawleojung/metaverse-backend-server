import { BaseTypeEntity } from './baseTypeEntity.entity';
import { CommerceZoneItem } from './commerceZoneItem.entity';
import { Entity, OneToMany } from 'typeorm';

@Entity('avatar_parts_color_type')
export class AvatarPartsColorType extends BaseTypeEntity {
  @OneToMany(() => CommerceZoneItem, (item) => item.AvatarPartsColorType)
  CommerceZoneItems: CommerceZoneItem[];
}

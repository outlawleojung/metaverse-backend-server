import { Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CommerceZoneItem } from './commerceZoneItem.entity';
import { Localization } from './localization.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Index('name', ['name'], {})
@Entity('avatar_parts_group_type')
export class AvatarPartsGroupType extends BaseTypeEntity {
  @OneToMany(() => CommerceZoneItem, (item) => item.AvatarPartsGroupType)
  CommerceZoneItems: CommerceZoneItem[];

  @ManyToOne(
    () => Localization,
    (localization) => localization.AvatarPartsGroupTypes,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'name' })
  LocalizationName: Localization;
}

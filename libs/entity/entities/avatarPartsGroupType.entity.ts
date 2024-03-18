import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { CommerceZoneItem } from './commerceZoneItem.entity';
import { Localization } from './localization.entity';

@Index('name', ['name'], {})
@Entity('avatar_parts_group_type')
export class AvatarPartsGroupType {
  @PrimaryColumn('int', { name: 'type' })
  type: number;

  @Column('varchar', { name: 'name', length: 64 })
  name: string;

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
  @JoinColumn([{ name: 'name', referencedColumnName: 'id' }])
  LocalizationName: Localization;
}

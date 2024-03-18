import { Item } from './item.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { AvatarPresetType } from './avatarPresetType.entity';
import { AvatarPartsType } from './avatarPartsType.entity';

@Index('partsType', ['partsType'], {})
@Index('itemId', ['itemId'], {})
@Entity('avatar_preset')
export class AvatarPreset {
  @PrimaryColumn('int', { name: 'presetType' })
  presetType: number;

  @PrimaryColumn('int', { name: 'partsType' })
  partsType: number;

  @Column('int', { name: 'itemId' })
  itemId: number;

  @ManyToOne(
    () => AvatarPresetType,
    (avatarpresettype) => avatarpresettype.AvatarPresets,
    {
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn([{ name: 'presetType', referencedColumnName: 'type' }])
  AvatarPresetType: AvatarPresetType;

  @ManyToOne(
    () => AvatarPartsType,
    (avatarpartstype) => avatarpartstype.AvatarPresets,
    {
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn([{ name: 'partsType', referencedColumnName: 'type' }])
  AvatarPartsType: AvatarPartsType;

  @ManyToOne(() => Item, (item) => item.AvatarPresets, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'itemId', referencedColumnName: 'id' }])
  Item: Item;
}

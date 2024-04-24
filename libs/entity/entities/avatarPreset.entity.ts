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
  @PrimaryColumn('int')
  presetType: number;

  @PrimaryColumn('int')
  partsType: number;

  @Column('int')
  itemId: number;

  @ManyToOne(
    () => AvatarPresetType,
    (avatarpresettype) => avatarpresettype.AvatarPresets,
    {
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'presetType' })
  AvatarPresetType: AvatarPresetType;

  @ManyToOne(
    () => AvatarPartsType,
    (avatarpartstype) => avatarpartstype.AvatarPresets,
    {
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'partsType' })
  AvatarPartsType: AvatarPartsType;

  @ManyToOne(() => Item, (item) => item.AvatarPresets, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'itemId' })
  Item: Item;
}

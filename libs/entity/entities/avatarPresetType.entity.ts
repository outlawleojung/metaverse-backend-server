import { Entity, OneToMany } from 'typeorm';
import { AvatarPreset } from './avatarPreset.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('avatar_preset_type')
export class AvatarPresetType extends BaseTypeEntity {
  @OneToMany(
    () => AvatarPreset,
    (avatarpreset) => avatarpreset.AvatarPresetType,
  )
  AvatarPresets: AvatarPreset[];
}

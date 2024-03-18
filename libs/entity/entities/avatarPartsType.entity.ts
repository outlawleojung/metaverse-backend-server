import { Entity, OneToMany } from 'typeorm';
import { AvatarPreset } from './avatarPreset.entity';
import { CommerceZoneMannequin } from './commerceZoneMannequin.entity';
import { AvatarResetInfo } from './avatarResetInfo.entity';
import { ItemUseEffect } from './itemUseEffect.entity';
import { NpcCostume } from './npcCostume.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('avatar_parts_type')
export class AvatarPartsType extends BaseTypeEntity {
  @OneToMany(() => AvatarPreset, (avatarpreset) => avatarpreset.AvatarPartsType)
  AvatarPresets: AvatarPreset[];

  @OneToMany(
    () => CommerceZoneMannequin,
    (commercezonemannequin) => commercezonemannequin.AvatarPartsType,
  )
  CommerceZoneMannequins: CommerceZoneMannequin[];

  @OneToMany(
    () => AvatarResetInfo,
    (avatarresetIinfo) => avatarresetIinfo.AvatarPartsType,
  )
  AvatarResetInfos: AvatarResetInfo[];

  @OneToMany(
    () => ItemUseEffect,
    (itemuseeffect) => itemuseeffect.AvatarPartsType,
  )
  ItemUseEffects: ItemUseEffect[];

  @OneToMany(() => NpcCostume, (npccostume) => npccostume.AvatarPartsType)
  NpcCostumes: NpcCostume[];
}

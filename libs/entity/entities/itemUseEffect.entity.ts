import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { Localization } from './localization.entity';
import { AvatarPartsType } from './avatarPartsType.entity';
import { MemberAvatarInfo } from './memberAvatarInfo.entity';

@Index('chat', ['chat'], {})
@Index('partsType', ['partsType'], {})
@Entity('item_use_effect')
export class ItemUseEffect {
  @PrimaryColumn('int', { name: 'itemId' })
  itemId: number;

  @Column('varchar', { name: 'chat', length: 64 })
  chat: string;

  @Column('varchar', { name: 'animationName', length: 64 })
  animationName: string;

  @Column('int', { name: 'partsType' })
  partsType: number;

  @OneToMany(() => MemberAvatarInfo, (info) => info.ItemUseEffect)
  MemberAvatarInfos: MemberAvatarInfo[];

  @ManyToOne(() => Localization, (localization) => localization.ItemUseEffects, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'chat', referencedColumnName: 'id' }])
  LocalizationChat: Localization;

  @ManyToOne(() => AvatarPartsType, (avatarpartstype) => avatarpartstype.ItemUseEffects, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'partsType', referencedColumnName: 'type' }])
  AvatarPartsType: AvatarPartsType;
}

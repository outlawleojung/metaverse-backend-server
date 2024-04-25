import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { Localization } from './localization.entity';
import { AvatarPartsType } from './avatarPartsType.entity';
import { MemberAvatarInfo } from './memberAvatarInfo.entity';
import { Item } from './item.entity';

@Index('chat', ['chat'], {})
@Index('partsType', ['partsType'], {})
@Index('itemId_partsType', ['itemId', 'partsType'], {})
@Entity('item_use_effect')
export class ItemUseEffect {
  @PrimaryColumn('int')
  itemId: number;

  @Column('varchar', { length: 64 })
  chat: string;

  @Column('varchar', { length: 64 })
  animationName: string;

  @Column('int')
  partsType: number;

  @OneToMany(() => MemberAvatarInfo, (info) => info.ItemUseEffect)
  MemberAvatarInfos: MemberAvatarInfo[];

  @ManyToOne(() => Item, (item) => item.ItemUseEffects, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'itemId' })
  Item: Item;

  @ManyToOne(
    () => Localization,
    (localization) => localization.ItemUseEffects,
    {
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'chat' })
  LocalizationChat: Localization;

  @ManyToOne(
    () => AvatarPartsType,
    (avatarpartstype) => avatarpartstype.ItemUseEffects,
    {
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'partsType' })
  AvatarPartsType: AvatarPartsType;
}

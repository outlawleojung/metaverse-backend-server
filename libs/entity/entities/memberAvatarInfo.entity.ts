import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Member } from './member.entity';
import { ItemUseEffect } from './itemUseEffect.entity';

@Index('avatarPartsType', ['avatarPartsType'], {})
@Index('itemId', ['itemId'], {})
@Index('avatarPartsType_itemId', ['avatarPartsType', 'itemId'], {})
@Entity('member_avatar_info')
export class MemberAvatarInfo {
  @PrimaryColumn('uuid')
  memberId: string;

  @PrimaryColumn('int', { name: 'avatarPartsType' })
  avatarPartsType: number;

  @Column('int', { name: 'itemId' })
  itemId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Member, (member) => member.MemberAvatarInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'memberId' }])
  Member: Member;

  @ManyToOne(() => ItemUseEffect, (effect) => effect.MemberAvatarInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([
    { name: 'avatarPartsType', referencedColumnName: 'partsType' },
    { name: 'itemId', referencedColumnName: 'itemId' },
  ])
  ItemUseEffect: ItemUseEffect;
}

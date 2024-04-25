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
@Index('itemId_avatarPartsType', ['itemId', 'avatarPartsType'], {})
@Entity('member_avatar_info')
export class MemberAvatarInfo {
  @PrimaryColumn('uuid')
  memberId: string;

  @PrimaryColumn('int')
  avatarPartsType: number;

  @Column('int')
  itemId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Member, (member) => member.MemberAvatarInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'memberId' })
  Member: Member;

  @ManyToOne(() => ItemUseEffect, (effect) => effect.MemberAvatarInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([
    { name: 'itemId', referencedColumnName: 'itemId' },
    { name: 'avatarPartsType', referencedColumnName: 'partsType' },
  ])
  ItemUseEffect: ItemUseEffect;
}

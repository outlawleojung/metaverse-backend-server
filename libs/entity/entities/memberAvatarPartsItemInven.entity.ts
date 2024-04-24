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

import { Item } from './item.entity';
import { ItemType } from './itemType.entity';
import { Member } from './member.entity';

@Index('itemId', ['itemId'], {})
@Index('itemType', ['itemType'], {})
@Entity('member_avatar_parts_item_inven')
export class MemberAvatarPartsItemInven {
  @PrimaryColumn('uuid')
  memberId: string;

  @PrimaryColumn('int')
  itemId: number;

  @Column('int')
  itemType: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Member, (member) => member.MemberAvatarPartsItemInvens, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'memberId' })
  Member: Member;

  @ManyToOne(() => Item, (item) => item.MemberAvatarPartsItemInvens, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'itemId' })
  Item: Item;

  @ManyToOne(() => ItemType, (type) => type.MemberAvatarPartsItemInvens, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'itemType' })
  ItemType: ItemType;
}

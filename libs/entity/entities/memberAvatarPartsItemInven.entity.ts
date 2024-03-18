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
import { Item } from './item.entity';
import { ItemType } from './itemType.entity';

@Index('itemId', ['itemId'], {})
@Index('itemType', ['itemType'], {})
@Entity('member_avatar_parts_item_inven')
export class MemberAvatarPartsItemInven {
  @PrimaryColumn('varchar', { name: 'memberId', length: 100 })
  memberId: string;

  @PrimaryColumn('int', { name: 'itemId' })
  itemId: number;

  @Column('int', { name: 'itemType' })
  itemType: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Member, (member) => member.MemberAvatarPartsItemInvens, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'memberId', referencedColumnName: 'memberId' }])
  Member: Member;

  @ManyToOne(() => Item, (item) => item.MemberAvatarPartsItemInvens, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'itemId', referencedColumnName: 'id' }])
  Item: Item;

  @ManyToOne(() => ItemType, (type) => type.MemberAvatarPartsItemInvens, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'itemType', referencedColumnName: 'type' }])
  ItemType: ItemType;
}

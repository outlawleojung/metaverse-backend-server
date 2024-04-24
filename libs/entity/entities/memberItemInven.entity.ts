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

@Index('itemId', ['itemId'], {})
@Entity('member_item_inven')
export class MemberItemInven {
  @PrimaryColumn('uuid')
  memberId: string;

  @PrimaryColumn('int')
  itemId: number;

  @Column('int')
  num: number;

  @Column('int')
  count: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Member, (member) => member.MemberItemInvens, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'memberId' })
  Member: Member;

  @ManyToOne(() => Item, (item) => item.MemberItemInvens, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'itemId' })
  Item: Item;
}

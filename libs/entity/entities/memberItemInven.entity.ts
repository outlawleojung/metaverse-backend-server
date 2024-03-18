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
  @PrimaryColumn('varchar', { name: 'memberId', length: 100 })
  memberId: string;

  @PrimaryColumn('int', { name: 'itemId' })
  itemId: number;

  @Column('int', { name: 'num' })
  num: number;

  @Column('int', { name: 'count' })
  count: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Member, (member) => member.MemberItemInvens, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'memberId', referencedColumnName: 'memberId' }])
  Member: Member;

  @ManyToOne(() => Item, (item) => item.MemberItemInvens, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'itemId', referencedColumnName: 'id' }])
  Item: Item;
}

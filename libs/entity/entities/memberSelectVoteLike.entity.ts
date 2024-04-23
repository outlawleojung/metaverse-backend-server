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
import { SelectVoteItem } from './selectVoteItem.entity';

@Index('voteId_itemNum', ['voteId', 'itemNum'], {})
@Entity('member_select_vote_like')
export class MemberSelectVoteLike {
  @PrimaryColumn('uuid')
  memberId: string;

  @PrimaryColumn('int', { name: 'voteId' })
  voteId: number;

  @PrimaryColumn('int', { name: 'itemNum' })
  itemNum: number;

  @Column('int', { name: 'isLike' })
  isLike: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Member, (member) => member.MemberSelectVoteLikes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'memberId' }])
  Member: Member;

  @ManyToOne(() => SelectVoteItem, (item) => item.MemberSelectVoteLikes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([
    { name: 'voteId', referencedColumnName: 'voteId' },
    { name: 'itemNum', referencedColumnName: 'itemNum' },
  ])
  SelectVoteItem: SelectVoteItem;
}

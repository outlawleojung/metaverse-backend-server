import {
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

@Index('voteId', ['voteId'], {})
@Index('voteId_num', ['voteId', 'itemNum'], {})
@Entity('member_select_vote_info')
export class MemberSelectVoteInfo {
  @PrimaryColumn('uuid')
  memberId: string;

  @PrimaryColumn('int', { name: 'voteId' })
  voteId: number;

  @PrimaryColumn('int', { name: 'itemNum' })
  itemNum: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Member, (member) => member.MemberSelectVoteInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'memberId' }])
  Member: Member;

  @ManyToOne(
    () => SelectVoteItem,
    (voteinfo) => voteinfo.MemberSelectVoteInfos,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn([
    { name: 'voteId', referencedColumnName: 'voteId' },
    { name: 'itemNum', referencedColumnName: 'itemNum' },
  ])
  SelectVoteItem: SelectVoteItem;
}

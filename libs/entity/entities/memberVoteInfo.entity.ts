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
import { VoteInfoExample } from './voteInfoExample.entity';

@Index('voteId', ['voteId'], {})
@Index('voteId_num', ['voteId', 'num'], {})
@Entity('member_vote_info')
export class MemberVoteInfo {
  @PrimaryColumn('uuid')
  memberId: string;

  @PrimaryColumn('int', { name: 'voteId' })
  voteId: number;

  @PrimaryColumn('int', { name: 'num' })
  num: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Member, (member) => member.MemberVoteInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'memberId' }])
  Member: Member;

  @ManyToOne(() => VoteInfoExample, (voteinfo) => voteinfo.MemberVoteInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([
    { name: 'voteId', referencedColumnName: 'voteId' },
    { name: 'num', referencedColumnName: 'num' },
  ])
  VoteInfoExample: VoteInfoExample;
}

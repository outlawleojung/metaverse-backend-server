import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { VoteInfo } from './voteInfo.entity';
import { MemberVoteInfo } from './memberVoteInfo.entity';

@Entity('vote_info_example')
export class VoteInfoExample {
  @PrimaryColumn('int')
  voteId: number;

  @PrimaryColumn('int')
  num: number;

  @Column('varchar', { length: 128 })
  contents: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => VoteInfo, (voteinfo) => voteinfo.VoteInfoExamples, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'voteId' })
  VoteInfo: VoteInfo;

  @OneToMany(
    () => MemberVoteInfo,
    (membervoteinfo) => membervoteinfo.VoteInfoExample,
  )
  MemberVoteInfos: MemberVoteInfo[];
}

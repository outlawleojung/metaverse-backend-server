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

import { SelectVoteInfo } from './selectVoteInfo.entity';
import { MemberSelectVoteInfo } from './memberSelectVoteInfo.entity';
import { MemberSelectVoteLike } from './memberSelectVoteLike.entity';

@Entity('select_vote_item')
export class SelectVoteItem {
  @PrimaryColumn('int')
  voteId: number;

  @PrimaryColumn('int')
  itemNum: number;

  @Column('int')
  displayNum: number;

  @Column('varchar', { length: 32 })
  name: string;

  @Column('varchar', { length: 128 })
  description: string;

  @Column('varchar', { length: 256 })
  videoUrl: string;

  @Column('varchar', { length: 128 })
  imageName: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => SelectVoteInfo, (info) => info.SelectVoteItems, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'voteId' })
  SelectVoteInfo: SelectVoteInfo;

  @OneToMany(() => MemberSelectVoteInfo, (info) => info.SelectVoteItem)
  MemberSelectVoteInfos: MemberSelectVoteInfo[];

  @OneToMany(() => MemberSelectVoteLike, (info) => info.SelectVoteItem)
  MemberSelectVoteLikes: MemberSelectVoteLike[];
}

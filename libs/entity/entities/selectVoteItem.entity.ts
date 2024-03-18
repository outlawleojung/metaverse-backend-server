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
  @PrimaryColumn('int', { name: 'voteId' })
  voteId: number;

  @PrimaryColumn('int', { name: 'itemNum' })
  itemNum: number;

  @Column('int', { name: 'displayNum' })
  displayNum: number;

  @Column('varchar', { name: 'name', length: 32 })
  name: string;

  @Column('varchar', { name: 'description', length: 128 })
  description: string;

  @Column('varchar', { name: 'videoUrl', length: 256 })
  videoUrl: string;

  @Column('varchar', { name: 'imageName', length: 128 })
  imageName: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => SelectVoteInfo, (info) => info.SelectVoteItems, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'voteId', referencedColumnName: 'id' }])
  SelectVoteInfo: SelectVoteInfo;

  @OneToMany(() => MemberSelectVoteInfo, (info) => info.SelectVoteItem)
  MemberSelectVoteInfos: MemberSelectVoteInfo[];

  @OneToMany(() => MemberSelectVoteLike, (info) => info.SelectVoteItem)
  MemberSelectVoteLikes: MemberSelectVoteLike[];
}

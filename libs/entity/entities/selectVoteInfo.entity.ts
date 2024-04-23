import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { VoteResultExposureType } from './voteResultExposureType.entity';
import { VoteResultType } from './voteResultType.entity';
import { SelectVoteItem } from './selectVoteItem.entity';
import { Admin } from './admin.entity';

@Index('resultType', ['resultType'], {})
@Index('resultExposureType', ['resultExposureType'], {})
@Index('adminId', ['adminId'], {})
@Entity('select_vote_info')
export class SelectVoteInfo {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', length: 64 })
  name: string;

  @Column('int', { name: 'voteCount' })
  voteCount: number;

  @Column('int', { name: 'resultType' })
  resultType: number;

  @Column('int', { name: 'resultExposureType' })
  resultExposureType: number;

  @Column()
  adminId: number;

  @Column('datetime', { name: 'startedAt' })
  startedAt: Date;

  @Column('datetime', { name: 'endedAt' })
  endedAt: Date;

  @Column('datetime', { name: 'resultStartedAt' })
  resultStartedAt: Date;

  @Column('datetime', { name: 'resultEndedAt' })
  resultEndedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => VoteResultExposureType, (type) => type.SelectVoteInfos, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'resultExposureType', referencedColumnName: 'type' }])
  VoteResultExposureType: VoteResultExposureType;

  @ManyToOne(() => VoteResultType, (type) => type.SelectVoteInfos, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'resultType', referencedColumnName: 'type' }])
  VoteResultType: VoteResultType;

  @ManyToOne(() => Admin, (admin) => admin.SelectVoteInfos, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'adminId' })
  admin: Admin;

  @OneToMany(() => SelectVoteItem, (item) => item.SelectVoteInfo)
  SelectVoteItems: SelectVoteItem[];
}

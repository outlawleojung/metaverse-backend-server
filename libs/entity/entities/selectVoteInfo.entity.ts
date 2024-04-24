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
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column('varchar', { length: 64 })
  name: string;

  @Column('int')
  voteCount: number;

  @Column('int')
  resultType: number;

  @Column('int')
  resultExposureType: number;

  @Column()
  adminId: number;

  @Column('datetime')
  startedAt: Date;

  @Column('datetime')
  endedAt: Date;

  @Column('datetime')
  resultStartedAt: Date;

  @Column('datetime')
  resultEndedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => VoteResultExposureType, (type) => type.SelectVoteInfos, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'resultExposureType' })
  VoteResultExposureType: VoteResultExposureType;

  @ManyToOne(() => VoteResultType, (type) => type.SelectVoteInfos, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'resultType' })
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

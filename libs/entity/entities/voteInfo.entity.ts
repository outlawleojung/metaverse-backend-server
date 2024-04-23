import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { VoteDivType } from './voteDivType.entity';
import { VoteResType } from './voteResType.entity';
import { VoteResultExposureType } from './voteResultExposureType.entity';
import { BooleanType } from './booleanType.entity';
import { VoteInfoExample } from './voteInfoExample.entity';
import { VoteAlterResType } from './voteAlterResType.entity';
import { Admin } from './admin.entity';

@Index('divType', ['divType'], {})
@Index('resType', ['resType'], {})
@Index('resultExposureType', ['resultExposureType'], {})
@Index('isExposingResult', ['isExposingResult'], {})
@Index('isEnabledEdit', ['isEnabledEdit'], {})
@Index('adminId', ['adminId'], {})
@Index('alterResType', ['alterResType'], {})
@Entity('vote_info')
export class VoteInfo {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', length: 64 })
  name: string;

  @Column('varchar', { name: 'question', length: 256 })
  question: string;

  @Column('varchar', { name: 'imageName', nullable: true, length: 128 })
  imageName: string | null;

  @Column('int', { name: 'divType' })
  divType: number;

  @Column('int', { name: 'resType' })
  resType: number;

  @Column('int', { name: 'alterResType' })
  alterResType: number;

  @Column('int', { name: 'resultExposureType' })
  resultExposureType: number;

  @Column('int', { name: 'isExposingResult', default: () => "'0'" })
  isExposingResult: number;

  @Column('int', { name: 'isEnabledEdit', default: () => "'0'" })
  isEnabledEdit: number;

  @Column()
  adminId: number;

  @Column('datetime', { name: 'startedAt' })
  startedAt: Date;

  @Column('datetime', { name: 'endedAt' })
  endedAt: Date;

  @Column('datetime', { name: 'resultEndedAt' })
  resultEndedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ select: false })
  deletedAt: Date | null;

  @ManyToOne(() => VoteDivType, (votedivtype) => votedivtype.VoteInfos, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'divType', referencedColumnName: 'type' }])
  VoteDivType: VoteDivType;

  @ManyToOne(
    () => VoteAlterResType,
    (voteAlterRestype) => voteAlterRestype.VoteInfos,
    {
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn([{ name: 'alterResType', referencedColumnName: 'type' }])
  VoteAlterResType: VoteAlterResType;

  @ManyToOne(() => VoteResType, (voterestype) => voterestype.VoteInfos, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'resType', referencedColumnName: 'type' }])
  VoteResType: VoteResType;

  @ManyToOne(
    () => VoteResultExposureType,
    (voteresulttype) => voteresulttype.VoteInfos,
    {
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn([{ name: 'resultExposureType', referencedColumnName: 'type' }])
  VoteResultExposureType: VoteResultExposureType;

  @ManyToOne(
    () => BooleanType,
    (booleantype) => booleantype.IsExposingResultVoteInfos,
    {
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn([{ name: 'isExposingResult', referencedColumnName: 'type' }])
  isExposingResultBool: BooleanType;

  @ManyToOne(
    () => BooleanType,
    (booleantype) => booleantype.IsEnabledEditVoteInfos,
    {
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn([{ name: 'isEnabledEdit', referencedColumnName: 'type' }])
  isEnabledEditBool: BooleanType;

  @ManyToOne(() => Admin, (admin) => admin.VoteInfos, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'adminId' })
  admin: Admin;

  @OneToMany(
    () => VoteInfoExample,
    (voteinfoexample) => voteinfoexample.VoteInfo,
  )
  VoteInfoExamples: VoteInfoExample[];
}

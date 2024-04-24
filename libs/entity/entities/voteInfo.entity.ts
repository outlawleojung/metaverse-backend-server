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
import { BaseModelEntity } from './baseModelEntity.entity';

@Index('divType', ['divType'], {})
@Index('resType', ['resType'], {})
@Index('resultExposureType', ['resultExposureType'], {})
@Index('isExposingResult', ['isExposingResult'], {})
@Index('isEnabledEdit', ['isEnabledEdit'], {})
@Index('adminId', ['adminId'], {})
@Index('alterResType', ['alterResType'], {})
@Entity('vote_info')
export class VoteInfo extends BaseModelEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column('varchar', { length: 64 })
  name: string;

  @Column('varchar', { length: 256 })
  question: string;

  @Column('varchar', { nullable: true, length: 128 })
  imageName: string | null;

  @Column('int')
  divType: number;

  @Column('int')
  resType: number;

  @Column('int')
  alterResType: number;

  @Column('int')
  resultExposureType: number;

  @Column('int', { default: 0 })
  isExposingResult: number;

  @Column('int', { default: 0 })
  isEnabledEdit: number;

  @Column()
  adminId: number;

  @Column('datetime')
  startedAt: Date;

  @Column('datetime')
  endedAt: Date;

  @Column('datetime')
  resultEndedAt: Date;

  @DeleteDateColumn({ select: false })
  deletedAt: Date | null;

  @ManyToOne(() => VoteDivType, (votedivtype) => votedivtype.VoteInfos, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'divType' })
  VoteDivType: VoteDivType;

  @ManyToOne(
    () => VoteAlterResType,
    (voteAlterRestype) => voteAlterRestype.VoteInfos,
    {
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'alterResType' })
  VoteAlterResType: VoteAlterResType;

  @ManyToOne(() => VoteResType, (voterestype) => voterestype.VoteInfos, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'resType' })
  VoteResType: VoteResType;

  @ManyToOne(
    () => VoteResultExposureType,
    (voteresulttype) => voteresulttype.VoteInfos,
    {
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'resultExposureType' })
  VoteResultExposureType: VoteResultExposureType;

  @ManyToOne(
    () => BooleanType,
    (booleantype) => booleantype.IsExposingResultVoteInfos,
    {
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'isExposingResult' })
  isExposingResultBool: BooleanType;

  @ManyToOne(
    () => BooleanType,
    (booleantype) => booleantype.IsEnabledEditVoteInfos,
    {
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'isEnabledEdit' })
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

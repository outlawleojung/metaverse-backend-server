import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Member } from './member.entity';
import { ReportCategory } from './reportCategory.entity';
import { ReportStateType } from './reportStateType.entity';
import { Admin } from './admin.entity';
import { BaseModelEntity } from './baseModelEntity.entity';

@Index('adminId', ['adminId'], {})
@Index('stateType', ['stateType'], {})
@Index('reportMemberId', ['reportMemberId'], {})
@Index('reportcategory', ['reportType', 'reasonType'], {})
@Index('targetMemberId', ['targetMemberId'], {})
@Entity('member_report_info')
export class MemberReportInfo extends BaseModelEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column('int', { name: 'stateType' })
  stateType: number;

  @Column('uuid')
  reportMemberId: string | null;

  @Column('varchar', { length: 64 })
  reportNickname: string;

  @Column('int')
  reportType: number;

  @Column('int')
  reasonType: number;

  @Column('varchar', { length: 1024 })
  content: string;

  @Column('uuid')
  targetMemberId: string | null;

  @Column('varchar', { length: 64 })
  targetNickname: string;

  @Column('varchar', { length: 1024 })
  images: string;

  @Column('datetime')
  reportedAt: Date;

  @Column('datetime')
  completedAt: Date;

  @Column('varchar', { length: 256 })
  comment: string;

  @Column({ nullable: true })
  adminId: number | null;

  @ManyToOne(() => Member, (member) => member.MemberReportInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'reportMemberId' })
  ReportMember: Member;

  @ManyToOne(
    () => ReportCategory,
    (reportCategory) => reportCategory.MemberReportInfos,
    {
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn([
    { name: 'reportType', referencedColumnName: 'reportType' },
    { name: 'reasonType', referencedColumnName: 'reasonType' },
  ])
  ReportCategory: ReportCategory;

  @ManyToOne(() => Member, (member) => member.MemberReportTargetInfos, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'targetMemberId' })
  TargetMember: Member;

  @ManyToOne(() => ReportStateType, (type) => type.MemberReportInfos, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'stateType' })
  ReportStateType: ReportStateType;

  @ManyToOne(() => Admin, (admin) => admin.MemberReportInfos, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'adminId' })
  admin: Admin;
}

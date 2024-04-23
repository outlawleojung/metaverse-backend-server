import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Member } from './member.entity';
import { ReportCategory } from './reportCategory.entity';
import { ReportStateType } from './reportStateType.entity';
import { Admin } from './admin.entity';

@Index('adminId', ['adminId'], {})
@Index('stateType', ['stateType'], {})
@Index('reportMemberId', ['reportMemberId'], {})
@Index('reportcategory', ['reportType', 'reasonType'], {})
@Index('targetMemberId', ['targetMemberId'], {})
@Entity('member_report_info')
export class MemberReportInfo {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'stateType' })
  stateType: number;

  @Column('varchar', { name: 'reportMemberId', nullable: true, length: 100 })
  reportMemberId: string | null;

  @Column('varchar', { name: 'reportNickname', length: 64 })
  reportNickname: string;

  @Column('int', { name: 'reportType' })
  reportType: number;

  @Column('int', { name: 'reasonType' })
  reasonType: number;

  @Column('varchar', { name: 'content', length: 1024 })
  content: string;

  @Column('varchar', { name: 'targetMemberId', nullable: true, length: 100 })
  targetMemberId: string | null;

  @Column('varchar', { name: 'targetNickname', length: 64 })
  targetNickname: string;

  @Column('varchar', { name: 'images', length: 1024 })
  images: string;

  @Column('datetime', { name: 'reportedAt' })
  reportedAt: Date;

  @Column('datetime', { name: 'completedAt' })
  completedAt: Date;

  @Column('varchar', { name: 'comment', length: 256 })
  comment: string;

  @Column({ nullable: true })
  adminId: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Member, (member) => member.MemberReportInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'reportMemberId', referencedColumnName: 'memberId' }])
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
  @JoinColumn([{ name: 'targetMemberId', referencedColumnName: 'memberId' }])
  TargetMember: Member;

  @ManyToOne(() => ReportStateType, (type) => type.MemberReportInfos, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'stateType', referencedColumnName: 'type' }])
  ReportStateType: ReportStateType;

  @ManyToOne(() => Admin, (admin) => admin.MemberReportInfos, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'adminId' }])
  admin: Admin;
}

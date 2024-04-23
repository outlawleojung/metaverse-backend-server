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
import { NoticeType } from './noticeType.entity';
import { NoticeExposureType } from './noticeExposureType.entity';
import { Admin } from './admin.entity';

@Index('noticeType', ['noticeType'], {})
@Index('noticeExposureType', ['noticeExposureType'], {})
@Index('adminId', ['adminId'], {})
@Entity('notice_info')
export class NoticeInfo {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column('int', { name: 'noticeType' })
  noticeType: number;

  @Column('int', { name: 'noticeExposureType' })
  noticeExposureType: number;

  @Column('varchar', { name: 'subject', length: 32 })
  subject: string;

  @Column('varchar', { name: 'koLink', length: 128 })
  koLink: string;

  @Column('varchar', { name: 'enLink', length: 128, nullable: true })
  enLink: string;

  @Column()
  adminId: number;

  @Column('datetime', { name: 'startedAt' })
  startedAt: Date;

  @Column('datetime', { name: 'endedAt' })
  endedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => NoticeType, (type) => type.NoticeInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'noticeType', referencedColumnName: 'type' }])
  NoticeType: NoticeType;

  @ManyToOne(() => NoticeExposureType, (type) => type.NoticeInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'noticeExposureType', referencedColumnName: 'type' }])
  NoticeExposureType: NoticeExposureType;

  @ManyToOne(() => Admin, (admin) => admin.NoticeInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'adminId' }])
  admin: Admin;
}

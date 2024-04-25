import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { NoticeType } from './noticeType.entity';
import { NoticeExposureType } from './noticeExposureType.entity';
import { Admin } from './admin.entity';
import { BaseModelEntity } from './baseModelEntity.entity';

@Index('noticeType', ['noticeType'], {})
@Index('noticeExposureType', ['noticeExposureType'], {})
@Index('adminId', ['adminId'], {})
@Entity('notice_info')
export class NoticeInfo extends BaseModelEntity {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column('int')
  noticeType: number;

  @Column('int')
  noticeExposureType: number;

  @Column('varchar', { length: 32 })
  subject: string;

  @Column('varchar', { length: 128 })
  koLink: string;

  @Column('varchar', { length: 128, nullable: true })
  enLink: string;

  @Column()
  adminId: number;

  @Column('datetime')
  startedAt: Date;

  @Column('datetime')
  endedAt: Date;

  @ManyToOne(() => NoticeType, (type) => type.NoticeInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'noticeType' })
  NoticeType: NoticeType;

  @ManyToOne(() => NoticeExposureType, (type) => type.NoticeInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'noticeExposureType' })
  NoticeExposureType: NoticeExposureType;

  @ManyToOne(() => Admin, (admin) => admin.NoticeInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'SET NULL',
  })
  @JoinColumn({ name: 'adminId' })
  admin: Admin;
}

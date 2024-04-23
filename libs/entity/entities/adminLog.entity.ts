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
import { LogActionType } from './logActionType.entity';
import { LogContentType } from './logContentType.entity';
import { Admin } from './admin.entity';

@Index('contentType', ['contentType'], {})
@Index('actionType', ['actionType'], {})
@Index('adminId', ['adminId'], {})
@Entity('admin_log')
export class AdminLog {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'contentType' })
  contentType: number;

  @Column('int', { name: 'actionType' })
  actionType: number;

  @Column('text', { name: 'beforeData', nullable: true })
  beforeData: string | null;

  @Column('text', { name: 'afterData', nullable: true })
  afterData: string | null;

  @Column()
  adminId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Admin, (admin) => admin.AdminLogs, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'adminId' }])
  admin: Admin;

  @ManyToOne(() => LogContentType, (type) => type.AdminLogs, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'contentType', referencedColumnName: 'type' }])
  LogContentType: LogContentType;

  @ManyToOne(() => LogActionType, (type) => type.AdminLogs, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'actionType', referencedColumnName: 'type' }])
  LogActionType: LogActionType;
}

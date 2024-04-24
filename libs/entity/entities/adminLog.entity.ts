import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LogActionType } from './logActionType.entity';
import { LogContentType } from './logContentType.entity';
import { Admin } from './admin.entity';
import { BaseModelEntity } from './baseModelEntity.entity';

@Index('contentType', ['contentType'], {})
@Index('actionType', ['actionType'], {})
@Index('adminId', ['adminId'], {})
@Entity('admin_log')
export class AdminLog extends BaseModelEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column('int')
  contentType: number;

  @Column('int')
  actionType: number;

  @Column('text', { nullable: true })
  beforeData: string | null;

  @Column('text', { nullable: true })
  afterData: string | null;

  @Column()
  adminId: number;

  @ManyToOne(() => Admin, (admin) => admin.AdminLogs, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'adminId' })
  admin: Admin;

  @ManyToOne(() => LogContentType, (type) => type.AdminLogs, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'contentType' })
  LogContentType: LogContentType;

  @ManyToOne(() => LogActionType, (type) => type.AdminLogs, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'actionType' })
  LogActionType: LogActionType;
}

import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PostalLogType } from './postalLogType.entity';
import { LogActionType } from './logActionType.entity';
import { Postbox } from './postbox.entity';
import { Admin } from './admin.entity';

@Index('postalLogType', ['postalLogType'], {})
@Index('logActionType', ['logActionType'], {})
@Index('postboxId', ['postboxId'], {})
@Entity('postal_log')
export class PostalLog {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'postboxId' })
  postboxId: number;

  @Column('int', { name: 'logActionType', nullable: true })
  logActionType: number;

  @Column('int', { name: 'postalLogType' })
  postalLogType: number;

  @Column('text', { name: 'prevData', nullable: true })
  prevData: string;

  @Column('text', { name: 'changeData', nullable: true })
  changeData: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Postbox, (box) => box.PostalLogs, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'postboxId', referencedColumnName: 'id' }])
  Postbox: Postbox;

  @ManyToOne(() => PostalLogType, (box) => box.PostalLogs, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'postalLogType', referencedColumnName: 'type' }])
  PostalLogType: PostalLogType;

  @ManyToOne(() => LogActionType, (box) => box.PostalLogs, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'logActionType', referencedColumnName: 'type' }])
  LogActionType: LogActionType;

  @ManyToOne(() => Admin, (admin) => admin.PostalLogs, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  admin: Admin;
}

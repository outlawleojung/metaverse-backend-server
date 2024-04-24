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
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column('int')
  postboxId: number;

  @Column('int', { nullable: true })
  logActionType: number;

  @Column('int')
  postalLogType: number;

  @Column('text', { nullable: true })
  prevData: string;

  @Column('text', { nullable: true })
  changeData: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Postbox, (box) => box.PostalLogs, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'postboxId' })
  Postbox: Postbox;

  @ManyToOne(() => PostalLogType, (box) => box.PostalLogs, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'postalLogType' })
  PostalLogType: PostalLogType;

  @ManyToOne(() => LogActionType, (box) => box.PostalLogs, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'logActionType' })
  LogActionType: LogActionType;

  @ManyToOne(() => Admin, (admin) => admin.PostalLogs, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  admin: Admin;
}

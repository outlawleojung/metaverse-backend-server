import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PostalType } from './postalType.entity';
import { PostalState } from './postalState.entity';
import { PostboxAppend } from './postboxAppend.entity';
import { PostReceiveMemberInfo } from './postReceiveMemberInfo.entity';
import { MemberPostbox } from './memberPostbox.entity';
import { PostalSendType } from './postalSendType.entity';
import { PostalLog } from './postalLog.entity';
import { Admin } from './admin.entity';
import { BaseModelEntity } from './baseModelEntity.entity';

@Index('postalType', ['postalType'], {})
@Index('postalSendype', ['postalSendType'], {})
@Index('postalState', ['postalState'], {})
@Index('subject', ['subject'], {})
@Index('summary', ['summary'], {})
@Index('content', ['content'], {})
@Index('adminId', ['adminId'], {})
@Entity('postbox')
export class Postbox extends BaseModelEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column('int')
  postalType: number;

  @Column('int')
  postalSendType: number;

  @Column('int', { default: 1 })
  postalState: number;

  @Column('varchar', { length: 32 })
  subject: string;

  @Column('varchar', { length: 64 })
  summary: string;

  @Column('varchar', { length: 640, nullable: true })
  content: string | null;

  @Column('int')
  period: number;

  @Column('int', { default: 0 })
  isSended: number;

  @Column()
  adminId: number;

  @Column('datetime')
  sendedAt: Date;

  @OneToOne(() => PostboxAppend, (append) => append.Postbox)
  PostboxAppend: PostboxAppend;

  @OneToMany(() => PostReceiveMemberInfo, (info) => info.Postbox)
  PostReceiveMemberInfos: PostReceiveMemberInfo[];

  @OneToMany(() => MemberPostbox, (box) => box.Postbox)
  MemberPostboxes: MemberPostbox[];

  @OneToMany(() => PostalLog, (log) => log.Postbox)
  PostalLogs: PostalLog[];

  @ManyToOne(() => PostalType, (type) => type.Postboxes, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'postalType' })
  PostalType: PostalType;

  @ManyToOne(() => PostalSendType, (type) => type.Postboxes, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'postalSendType' })
  PostalSendType: PostalSendType;

  @ManyToOne(() => PostalState, (state) => state.Postboxes, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'postalState' })
  PostalState: PostalState;

  @ManyToOne(() => Admin, (admin) => admin.Postboxes, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'adminId' })
  admin: Admin;
}

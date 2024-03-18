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
import { User } from './user.entity';
import { PostalSendType } from './postalSendType.entity';
import { PostalLog } from './postalLog.entity';

@Index('postalType', ['postalType'], {})
@Index('postalSendype', ['postalSendType'], {})
@Index('postalState', ['postalState'], {})
@Index('subject', ['subject'], {})
@Index('summary', ['summary'], {})
@Index('content', ['content'], {})
@Index('adminId', ['adminId'], {})
@Entity('postbox')
export class Postbox {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'postalType' })
  postalType: number;

  @Column('int', { name: 'postalSendType' })
  postalSendType: number;

  @Column('int', { name: 'postalState', default: () => "'1'" })
  postalState: number;

  @Column('varchar', { name: 'subject', length: 32 })
  subject: string;

  @Column('varchar', { name: 'summary', length: 64 })
  summary: string;

  @Column('varchar', { name: 'content', length: 640, nullable: true })
  content: string | null;

  @Column('int', { name: 'period' })
  period: number;

  @Column('int', { name: 'isSended', default: () => "'0'" })
  isSended: number;

  @Column('int', { name: 'adminId' })
  adminId: number;

  @Column('datetime', { name: 'sendedAt' })
  sendedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

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
  @JoinColumn([{ name: 'postalType', referencedColumnName: 'type' }])
  PostalType: PostalType;

  @ManyToOne(() => PostalSendType, (type) => type.Postboxes, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'postalSendType', referencedColumnName: 'type' }])
  PostalSendType: PostalSendType;

  @ManyToOne(() => PostalState, (state) => state.Postboxes, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'postalState', referencedColumnName: 'type' }])
  PostalState: PostalState;

  @ManyToOne(() => User, (user) => user.Postboxes, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'adminId', referencedColumnName: 'id' }])
  Admin: User;
}

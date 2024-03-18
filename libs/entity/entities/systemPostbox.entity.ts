import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PostalType } from './postalType.entity';
import { MemberPostbox } from './memberPostbox.entity';
import { SystemPostboxAppend } from './systemPostboxAppend.entity';

@Index('postalType', ['postalType'], {})
@Index('subject', ['subject'], {})
@Index('summary', ['summary'], {})
@Index('content', ['content'], {})
@Entity('system_postbox')
export class SystemPostbox {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'postalType' })
  postalType: number;

  @Column('varchar', { name: 'subject', length: 32 })
  subject: string;

  @Column('varchar', { name: 'summary', length: 64 })
  summary: string;

  @Column('varchar', { name: 'content', length: 640 })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => SystemPostboxAppend, (append) => append.SystemPostbox)
  SystemPostboxAppends: SystemPostboxAppend[];

  @OneToMany(() => MemberPostbox, (box) => box.SystemPostbox)
  MemberPostboxes: MemberPostbox[];

  @ManyToOne(() => PostalType, (type) => type.Postboxes, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'postalType', referencedColumnName: 'type' }])
  PostalType: PostalType;
}

import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PostalType } from './postalType.entity';
import { MemberPostbox } from './memberPostbox.entity';
import { SystemPostboxAppend } from './systemPostboxAppend.entity';
import { BaseModelEntity } from './baseModelEntity.entity';

@Index('postalType', ['postalType'], {})
@Index('subject', ['subject'], {})
@Index('summary', ['summary'], {})
@Index('content', ['content'], {})
@Entity('system_postbox')
export class SystemPostbox extends BaseModelEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column('int')
  postalType: number;

  @Column('varchar', { length: 32 })
  subject: string;

  @Column('varchar', { length: 64 })
  summary: string;

  @Column('varchar', { length: 640 })
  content: string;

  @OneToMany(() => SystemPostboxAppend, (append) => append.SystemPostbox)
  SystemPostboxAppends: SystemPostboxAppend[];

  @OneToMany(() => MemberPostbox, (box) => box.SystemPostbox)
  MemberPostboxes: MemberPostbox[];

  @ManyToOne(() => PostalType, (type) => type.Postboxes, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'postalType' })
  PostalType: PostalType;
}

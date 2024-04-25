import { SystemPostbox } from './systemPostbox.entity';
import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Member } from './member.entity';
import { Postbox } from './postbox.entity';

@Index('postboxId', ['postboxId'], {})
@Index('systemPostboxId', ['systemPostboxId'], {})
@Index('memberId', ['memberId'], {})
@Unique('unique_postbox_member', ['postboxId', 'systemPostboxId', 'memberId'])
@Entity('member_postbox')
@Check(
  '("postboxId" IS NOT NULL AND "systemPostboxId" IS NULL) OR ("postboxId" IS NULL AND "systemPostboxId" IS NOT NULL)',
)
export class MemberPostbox {
  @PrimaryColumn({ type: 'int' })
  id: number;

  @PrimaryColumn('uuid')
  memberId: string;

  @Column('int', { nullable: true })
  postboxId: number;

  @Column('int', { nullable: true })
  systemPostboxId: number;

  @Column('int', { default: 0 })
  isReceived: number;

  @Column('datetime', { nullable: true })
  receivedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Member, (member) => member.MemberPostboxes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'memberId' })
  Member: Member;

  @ManyToOne(() => Postbox, (postbox) => postbox.MemberPostboxes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'postboxId' })
  Postbox: Postbox;

  @ManyToOne(() => Postbox, (postbox) => postbox.MemberPostboxes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'systemPostboxId' })
  SystemPostbox: SystemPostbox;
}

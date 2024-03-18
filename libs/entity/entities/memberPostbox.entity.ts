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
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Member } from './member.entity';
import { Postbox } from './postbox.entity';

@Index('postboxId', ['postboxId'], {})
@Unique('unique_postbox_member', ['postboxId', 'systemPostboxId', 'memberId'])
@Entity('member_postbox')
@Check(
  '("postboxId" IS NOT NULL AND "systemPostboxId" IS NULL) OR ("postboxId" IS NULL AND "systemPostboxId" IS NOT NULL)',
)
export class MemberPostbox {
  @PrimaryColumn({ type: 'int', name: 'id' })
  id: number;

  @PrimaryColumn('varchar', { name: 'memberId', length: 100 })
  memberId: string;

  @Column('int', { name: 'postboxId', nullable: true })
  postboxId: number;

  @Column('int', { name: 'systemPostboxId', nullable: true })
  systemPostboxId: number;

  @Column('int', { name: 'isReceived', default: () => "'0'" })
  isReceived: number;

  @Column('datetime', { name: 'receivedAt', nullable: true })
  receivedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Member, (member) => member.MemberPostboxes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'memberId', referencedColumnName: 'memberId' }])
  Member: Member;

  @ManyToOne(() => Postbox, (postbox) => postbox.MemberPostboxes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'postboxId', referencedColumnName: 'id' }])
  Postbox: Postbox;

  @ManyToOne(() => Postbox, (postbox) => postbox.MemberPostboxes, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'systemPostboxId', referencedColumnName: 'id' }])
  SystemPostbox: SystemPostbox;
}

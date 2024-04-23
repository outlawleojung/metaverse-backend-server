import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Member } from './member.entity';

@Entity('session_info')
export class SessionInfo {
  @PrimaryColumn('uuid')
  memberId: string;

  @Column('varchar', { name: 'sessionId', nullable: true, length: 100 })
  sessionId: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Member, (member) => member.SessionInfo, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'memberId' }])
  Member: Member;
}

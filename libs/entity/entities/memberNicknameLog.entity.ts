import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Member } from './member.entity';

@Index('memberId', ['memberId'], {})
@Index('nickname', ['nickname'], {})
@Entity('member_nickname_log')
export class MemberNicknameLog {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('uuid')
  memberId: string;

  @Column('varchar', { unique: true, name: 'nickname', length: 64 })
  nickname: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Member, (member) => member.MemberNicknameLogs, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'memberId' }])
  Member: Member;
}

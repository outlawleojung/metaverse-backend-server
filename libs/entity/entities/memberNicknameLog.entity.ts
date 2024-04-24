import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Member } from './member.entity';
import { BaseModelEntity } from './baseModelEntity.entity';

@Index('memberId', ['memberId'], {})
@Index('nickname', ['nickname'], {})
@Entity('member_nickname_log')
export class MemberNicknameLog extends BaseModelEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column('uuid')
  memberId: string;

  @Column('varchar', { unique: true, length: 64 })
  nickname: string;

  @ManyToOne(() => Member, (member) => member.MemberNicknameLogs, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'memberId' })
  Member: Member;
}

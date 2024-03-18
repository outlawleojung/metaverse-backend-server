import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Member } from './member.entity';

@Index('friendMemberId', ['friendMemberId'], {})
@Entity('member_friend')
export class MemberFriend {
  @PrimaryColumn('varchar', { name: 'memberId', length: 100 })
  memberId: string;

  @PrimaryColumn('varchar', { name: 'friendMemberId', length: 100 })
  friendMemberId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('int', { name: 'bookmark' })
  bookmark: number;

  @Column('datetime', { name: 'bookmarkedAt', nullable: true })
  bookmarkedAt: Date | null;

  @ManyToOne(() => Member, (member) => member.OwnerMembers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'memberId', referencedColumnName: 'memberId' }])
  Member: Member;

  @ManyToOne(() => Member, (member) => member.MemberFriends, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'friendMemberId', referencedColumnName: 'memberId' }])
  friendMember: Member;
}

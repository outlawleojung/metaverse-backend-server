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
  @PrimaryColumn('uuid')
  memberId: string;

  @PrimaryColumn('uuid')
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
  @JoinColumn([{ name: 'memberId' }])
  Member: Member;

  @ManyToOne(() => Member, (member) => member.MemberFriends, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'friendMemberId' }])
  FriendMember: Member;
}

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

@Index('receivedMemberId', ['receivedMemberId'], {})
@Entity('member_friend_request')
export class MemberFriendRequest {
  @PrimaryColumn('uuid')
  requestMemberId: string;

  @PrimaryColumn('uuid')
  receivedMemberId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Member, (member) => member.RequestMembers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'requestMemberId' }])
  RequestMember: Member;

  @ManyToOne(() => Member, (member) => member.ReceivedMembers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'receivedMemberId' }])
  ReceivedMember: Member;
}

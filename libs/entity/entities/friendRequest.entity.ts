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
@Entity('friend_request')
export class FriendRequest {
  @PrimaryColumn('varchar', { name: 'requestMemberId', length: 100 })
  requestMemberId: string;

  @PrimaryColumn('varchar', { name: 'receivedMemberId', length: 100 })
  receivedMemberId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Member, (member) => member.RequestMembers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'requestMemberId', referencedColumnName: 'memberId' }])
  RequestMember: Member;

  @ManyToOne(() => Member, (member) => member.ReceivedMembers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'receivedMemberId', referencedColumnName: 'memberId' }])
  ReceivedMember: Member;
}

import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { Member } from './member.entity';

@Entity('member_login_reward_log')
export class MemberLoginRewardLog {
  @PrimaryColumn('varchar', { name: 'memberId', length: 100 })
  memberId: string;

  @Column('datetime', { name: 'loginedAt' })
  loginedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Member, (member) => member.MemberLoginRewardLog, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'memberId', referencedColumnName: 'memberId' }])
  Member: Member;
}

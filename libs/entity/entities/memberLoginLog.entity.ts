import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Member } from './member.entity';
import { ProviderType } from './providerType.entity';

@Index('memberId', ['memberId'], {})
@Index('providerType', ['providerType'], {})
@Entity('member_login_log')
export class MemberLoginLog {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'memberId', length: 100 })
  memberId: string;

  @Column('int', { name: 'providerType' })
  providerType: number;

  @Column('datetime', { name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Member, (member) => member.MemberLoginLogs, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'memberId', referencedColumnName: 'memberId' }])
  Member: Member;

  @ManyToOne(() => ProviderType, (providertype) => providertype.MemberLoginLogs, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'providerType', referencedColumnName: 'type' }])
  ProviderType: ProviderType;
}

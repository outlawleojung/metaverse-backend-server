import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Member } from './member.entity';
import { ProviderType } from './providerType.entity';
import { BaseModelEntity } from './baseModelEntity.entity';

@Index('memberId', ['memberId'], {})
@Index('providerType', ['providerType'], {})
@Entity('member_login_log')
export class MemberLoginLog extends BaseModelEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column('uuid')
  memberId: string;

  @Column('int')
  providerType: number;

  @ManyToOne(() => Member, (member) => member.MemberLoginLogs, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'memberId' })
  Member: Member;

  @ManyToOne(
    () => ProviderType,
    (providertype) => providertype.MemberLoginLogs,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'providerType' })
  ProviderType: ProviderType;
}

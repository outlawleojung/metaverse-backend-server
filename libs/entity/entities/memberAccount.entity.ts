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
import { ProviderType } from './providerType.entity';

@Index('providerType', ['providerType'], {})
@Index('accountToken', ['accountToken'], { unique: true })
@Entity('member_account')
export class MemberAccount {
  @PrimaryColumn('varchar', { name: 'memberId', length: 100 })
  memberId: string;

  @PrimaryColumn('int', { name: 'providerType' })
  providerType: number;

  @Column('varchar', { unique: true, name: 'accountToken', length: 100 })
  accountToken: string;

  @Column('varchar', { name: 'password', nullable: true, length: 100 })
  password: string | null;

  @Column('int', { name: 'regPathType', nullable: true })
  regPathType: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Member, (member) => member.MemberAccounts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'memberId', referencedColumnName: 'memberId' }])
  Member: Member;

  @ManyToOne(
    () => ProviderType,
    (providertype) => providertype.MemberAccounts,
    {
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn([{ name: 'providerType', referencedColumnName: 'type' }])
  ProviderType: ProviderType;
}

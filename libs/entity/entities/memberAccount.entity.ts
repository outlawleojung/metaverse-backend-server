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
  @Column('uuid')
  memberId: string;

  @PrimaryColumn('int')
  providerType: number;

  @Column('varchar', { unique: true, length: 100 })
  accountToken: string;

  @Column('varchar', { nullable: true, length: 100 })
  password: string | null;

  @Column('int', { nullable: true })
  regPathType: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Member, (member) => member.MemberAccounts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'memberId' })
  Member: Member;

  @ManyToOne(
    () => ProviderType,
    (providertype) => providertype.MemberAccounts,
    {
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'providerType' })
  ProviderType: ProviderType;
}

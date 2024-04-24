import {
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { InquiryType } from './inquiryType.entity';
import { MemberInquiry } from './memberInquiry.entity';
import { Member } from './member.entity';
import { BaseModelEntity } from './baseModelEntity.entity';

@Index('inquiryType', ['inquiryType'], {})
@Index('memberId', ['memberId'], {})
@Entity('member_inquiry_group')
export class MemberInquiryGroup extends BaseModelEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column('int')
  inquiryType: number;

  @Column('uuid')
  memberId: string;

  @Column('varchar', { length: 64 })
  subject: string;

  @Column('varchar', { length: 64 })
  email: string;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @ManyToOne(
    () => InquiryType,
    (inquirytype) => inquirytype.MemberInquiryGroups,
    {
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'inquiryType' })
  InquiryType: InquiryType;

  @ManyToOne(() => Member, (member) => member.MemberInquiryGroups, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'memberId' })
  Member: Member;

  @OneToMany(() => MemberInquiry, (inquiry) => inquiry.MemberInquiryGroup)
  MemberInquiries: MemberInquiry[];
}

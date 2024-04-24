import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MemberInquiryGroup } from './memberInquiryGroup.entity';
import { MemberInquiryManager } from './memberInquiryManager.entity';

@Index('groupId', ['groupId'], {})
@Entity('member_inquiry')
export class MemberInquiry {
  @PrimaryColumn('int')
  inquiryId: number;

  @Column('int')
  groupId: number;

  @Column('varchar', { length: 512 })
  content: string;

  @Column('varchar', { length: 1024, nullable: true })
  images: string;

  @Column('varchar', { length: 32 })
  appVersion: string;

  @Column('varchar', { length: 32 })
  deviceModel: string;

  @Column('varchar', { length: 64 })
  deviceOS: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @ManyToOne(
    () => MemberInquiryGroup,
    (inquirygroup) => inquirygroup.MemberInquiries,
    {
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'groupId' })
  MemberInquiryGroup: MemberInquiryGroup;

  @OneToOne(() => MemberInquiryManager, (state) => state.MemberInquiry, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'inquiryId' })
  MemberInquiryManager: MemberInquiryManager;
}

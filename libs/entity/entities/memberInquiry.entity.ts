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
  @PrimaryColumn('int', { name: 'inquiryId' })
  inquiryId: number;

  @Column('int', { name: 'groupId' })
  groupId: number;

  @Column('varchar', { name: 'content', length: 512 })
  content: string;

  @Column('varchar', { name: 'images', length: 1024, nullable: true })
  images: string;

  @Column('varchar', { name: 'appVersion', length: 32 })
  appVersion: string;

  @Column('varchar', { name: 'deviceModel', length: 32 })
  deviceModel: string;

  @Column('varchar', { name: 'deviceOS', length: 64 })
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
  @JoinColumn([{ name: 'groupId', referencedColumnName: 'id' }])
  MemberInquiryGroup: MemberInquiryGroup;

  @OneToOne(() => MemberInquiryManager, (state) => state.MemberInquiry, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'inquiryId', referencedColumnName: 'id' }])
  MemberInquiryManager: MemberInquiryManager;
}

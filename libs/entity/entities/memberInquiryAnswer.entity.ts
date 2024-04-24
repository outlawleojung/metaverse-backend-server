import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MemberInquiryManager } from './memberInquiryManager.entity';
import { Admin } from './admin.entity';

@Entity('member_inquiry_answer')
export class MemberInquiryAnswer {
  @PrimaryColumn('int')
  inquiryId: number;

  @Column('varchar', { length: 512 })
  content: string;

  @Column()
  adminId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToOne(
    () => MemberInquiryManager,
    (inquiry) => inquiry.MemberInquiryAnswer,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'inquiryId' })
  MemberInquiryManager: MemberInquiryManager;

  @ManyToOne(() => Admin, (admin) => admin.MemberInquiryAnswers, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'adminId' })
  admin: Admin;
}

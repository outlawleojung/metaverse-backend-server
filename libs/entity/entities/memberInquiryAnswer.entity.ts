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
import { User } from './user.entity';
import { MemberInquiryManager } from './memberInquiryManager.entity';

@Entity('member_inquiry_answer')
export class MemberInquiryAnswer {
  @PrimaryColumn('int', { name: 'inquiryId' })
  inquiryId: number;

  @Column('varchar', { name: 'content', length: 512 })
  content: string;

  @Column('int', { name: 'adminId' })
  adminId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToOne(() => MemberInquiryManager, (inquiry) => inquiry.MemberInquiryAnswer, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'inquiryId', referencedColumnName: 'id' }])
  MemberInquiryManager: MemberInquiryManager;

  @ManyToOne(() => User, (user) => user.MemberInquiryAnswers, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'adminId', referencedColumnName: 'id' }])
  Admin: User;
}

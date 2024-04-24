import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MemberInquiry } from './memberInquiry.entity';
import { MemberInquiryAnswer } from './memberInquiryAnswer.entity';
import { InquiryAnswerType } from './inquiryAnswerType.entity';

@Entity('member_inquiry_manager')
export class MemberInquiryManager {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column('int')
  answerType: number;

  @Column('datetime', { nullable: true })
  reservationAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToOne(
    () => MemberInquiry,
    (memberinquiry) => memberinquiry.MemberInquiryManager,
  )
  MemberInquiry: MemberInquiry;

  @OneToOne(
    () => MemberInquiryAnswer,
    (memberinquiryanswer) => memberinquiryanswer.MemberInquiryManager,
  )
  MemberInquiryAnswer: MemberInquiryAnswer;

  @ManyToOne(
    () => InquiryAnswerType,
    (inquiryanswertype) => inquiryanswertype.MemberInquiryManagers,
    {
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'answerType' })
  InquiryAnswerType: InquiryAnswerType;
}

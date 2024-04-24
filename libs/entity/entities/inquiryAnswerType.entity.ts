import { BaseTypeEntity } from './baseTypeEntity.entity';
import { MemberInquiryManager } from './memberInquiryManager.entity';
import { Entity, OneToMany } from 'typeorm';

@Entity('inquiry_answer_type')
export class InquiryAnswerType extends BaseTypeEntity {
  @OneToMany(() => MemberInquiryManager, (state) => state.InquiryAnswerType)
  MemberInquiryManagers: MemberInquiryManager[];
}

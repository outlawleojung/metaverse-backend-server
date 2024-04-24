import { Entity, OneToMany } from 'typeorm';

import { MemberInquiryGroup } from './memberInquiryGroup.entity';
import { InquiryTemplate } from './inquiryTemplate.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('inquiry_type')
export class InquiryType extends BaseTypeEntity {
  @OneToMany(
    () => InquiryTemplate,
    (inquirytemplate) => inquirytemplate.InquiryType,
  )
  InquiryTemplates: InquiryTemplate[];

  @OneToMany(
    () => MemberInquiryGroup,
    (memberinquirygroup) => memberinquirygroup.InquiryType,
  )
  MemberInquiryGroups: MemberInquiryGroup[];
}

import { BusinessCardTemplate } from './businessCardTemplate.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Member } from './member.entity';

@Index('templateId', ['templateId'], {})
@Entity('member_default_card_info')
export class MemberDefaultCardInfo {
  @PrimaryColumn('uuid')
  memberId: string;

  @Column('int', { default: 1 })
  templateId: number;

  @Column('int', { default: 1 })
  num: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Member, (member) => member.MemberDefaultCardInfo, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'memberId' })
  Member: Member;

  @ManyToOne(
    () => BusinessCardTemplate,
    (businesscardtemplate) => businesscardtemplate.MemberDefaultCardInfos,
    {
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'templateId' })
  BusinessCardTemplate: BusinessCardTemplate;
}

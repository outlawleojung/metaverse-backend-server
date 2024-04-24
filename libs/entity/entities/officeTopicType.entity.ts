import { Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { MemberOfficeReservationInfo } from './memberOfficeReservationInfo.entity';
import { Localization } from './localization.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Index('name', ['name'], {})
@Entity('office_topic_type')
export class OfficeTopicType extends BaseTypeEntity {
  @OneToMany(
    () => MemberOfficeReservationInfo,
    (memberOfficeReservationInfo) =>
      memberOfficeReservationInfo.OfficeTopicType,
  )
  MemberOfficeReservationInfos: MemberOfficeReservationInfo[];

  @ManyToOne(
    () => Localization,
    (localization) => localization.OfficeTopicTypes,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'name' })
  LocalizationName: Localization;
}

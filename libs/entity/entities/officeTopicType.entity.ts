import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { MemberOfficeReservationInfo } from './memberOfficeReservationInfo.entity';
import { Localization } from './localization.entity';

@Index('name', ['name'], {})
@Entity('office_topic_type')
export class OfficeTopicType {
  @PrimaryColumn('int', { name: 'type' })
  type: number;

  @Column('varchar', { name: 'name', length: 64 })
  name: string;

  @OneToMany(
    () => MemberOfficeReservationInfo,
    (memberOfficeReservationInfo) => memberOfficeReservationInfo.OfficeTopicType,
  )
  MemberOfficeReservationInfos: MemberOfficeReservationInfo[];

  @ManyToOne(() => Localization, (localization) => localization.OfficeTopicTypes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'name', referencedColumnName: 'id' }])
  LocalizationName: Localization;
}

import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { MemberOfficeReservationInfo } from './memberOfficeReservationInfo.entity';
import { Localization } from './localization.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Index('name', ['name'], {})
@Entity('office_alarm_type')
export class OfficeAlarmType extends BaseTypeEntity {
  @OneToMany(
    () => MemberOfficeReservationInfo,
    (memberOfficeReservationInfo) => memberOfficeReservationInfo.OfficeAlarmType,
  )
  MemberOfficeReservationInfos: MemberOfficeReservationInfo[];

  @ManyToOne(() => Localization, (localization) => localization.OfficeAlarmTypes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'name', referencedColumnName: 'id' }])
  LocalizationName: Localization;
}

import { Column, Entity, OneToMany } from 'typeorm';
import { NoticeInfo } from './noticeInfo.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('notice_exposure_type')
export class NoticeExposureType extends BaseTypeEntity {
  @OneToMany(() => NoticeInfo, (info) => info.NoticeExposureType)
  NoticeInfos: NoticeInfo[];
}

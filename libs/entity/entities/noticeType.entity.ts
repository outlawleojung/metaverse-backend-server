import { Entity, OneToMany } from 'typeorm';
import { NoticeInfo } from './noticeInfo.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('notice_type')
export class NoticeType extends BaseTypeEntity {
  @OneToMany(() => NoticeInfo, (info) => info.NoticeType)
  NoticeInfos: NoticeInfo[];
}

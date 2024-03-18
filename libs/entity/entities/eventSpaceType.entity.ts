import { Entity, OneToMany } from 'typeorm';
import { CSAFEventInfo } from './csafEventInfo.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('event_space_type')
export class EventSpaceType extends BaseTypeEntity {
  @OneToMany(() => CSAFEventInfo, (info) => info.EventSpaceType)
  CSAFEventInfos: CSAFEventInfo[];
}

import { Entity, ManyToMany, OneToMany } from 'typeorm';
import { VideoScreenInfo } from './videoScreenInfo.entity';
import { WorldType } from './worldType.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('area_type')
export class AreaType extends BaseTypeEntity {
  @OneToMany(
    () => VideoScreenInfo,
    (videoscreeninfo) => videoscreeninfo.AreaType,
  )
  VideoScreenInfos: VideoScreenInfo[];

  @ManyToMany(() => WorldType, (worldtype) => worldtype.AreaTypes)
  WorldTypes: WorldType[];
}

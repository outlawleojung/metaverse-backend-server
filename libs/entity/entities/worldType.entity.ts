import { Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { VideoScreenInfo } from './videoScreenInfo.entity';
import { AreaType } from './areaType.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('world_type')
export class WorldType extends BaseTypeEntity {
  @OneToMany(
    () => VideoScreenInfo,
    (videoscreeninfo) => videoscreeninfo.WorldType,
  )
  VideoScreenInfos: VideoScreenInfo[];

  @ManyToMany(() => AreaType, (areatype) => areatype.WorldTypes)
  @JoinTable({
    name: 'world_area_info',
    joinColumns: [{ name: 'worldType', referencedColumnName: 'type' }],
    inverseJoinColumns: [{ name: 'areaType', referencedColumnName: 'type' }],
    schema: process.env.DB_DATABASE,
  })
  AreaTypes: AreaType[];
}

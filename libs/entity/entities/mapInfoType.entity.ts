import { Entity, OneToMany } from 'typeorm';
import { MapExposulInfo } from './mapExposulInfo.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('map_info_type')
export class MapInfoType extends BaseTypeEntity {
  @OneToMany(
    () => MapExposulInfo,
    (mapexposulinfo) => mapexposulinfo.MapInfoType,
  )
  MapExposulInfos: MapExposulInfo[];
}

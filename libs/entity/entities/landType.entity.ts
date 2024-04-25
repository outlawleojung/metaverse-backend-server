import { Entity, OneToMany } from 'typeorm';

import { MapExposulInfo } from './mapExposulInfo.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('land_type')
export class LandType extends BaseTypeEntity {
  @OneToMany(() => MapExposulInfo, (mapexposulinfo) => mapexposulinfo.LandType)
  MapExposulInfos: MapExposulInfo[];
}

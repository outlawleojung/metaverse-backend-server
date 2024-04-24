import { MapInfoType } from './mapInfoType.entity';
import { LandType } from './landType.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { Localization } from './localization.entity';
import { MapExposulBrand } from './mapExposulBrand.entity';

@Index('name', ['name'], {})
@Index('description', ['description'], {})
@Entity('map_exposul_info')
export class MapExposulInfo {
  @PrimaryColumn('int')
  id: number;

  @Column('int')
  landType: number;

  @Column('int')
  mapInfoType: number;

  @Column('int')
  sort: number;

  @Column('varchar', { length: 64 })
  image: string;

  @Column('varchar', { length: 64 })
  name: string;

  @Column('varchar', { length: 64 })
  description: string;

  @Column('int')
  positionX: number;

  @Column('int')
  positionY: number;

  @Column('int')
  positionZ: number;

  @Column('int')
  rotationY: number;

  @ManyToOne(() => LandType, (type) => type.MapExposulInfos, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'landType' })
  LandType: LandType;

  @ManyToOne(() => MapInfoType, (type) => type.MapExposulInfos, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'mapInfoType' })
  MapInfoType: MapInfoType;

  @ManyToOne(
    () => Localization,
    (localization) => localization.MapExposulInfoNames,
    {
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'name' })
  LocalizationName: Localization;

  @ManyToOne(
    () => Localization,
    (localization) => localization.MapExposulInfoDescs,
    {
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'name' })
  LocalizationDesc: Localization;

  @OneToMany(
    () => MapExposulBrand,
    (mapexposulbrand) => mapexposulbrand.MapExposulInfo,
  )
  MapExposulBrands: MapExposulBrand[];
}

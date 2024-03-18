import { MapInfoType } from './mapInfoType.entity';
import { LandType } from './landType.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { Localization } from './localization.entity';
import { MapExposulBrand } from './mapExposulBrand.entity';

@Index('name', ['name'], {})
@Index('description', ['description'], {})
@Entity('map_exposul_info')
export class MapExposulInfo {
  @PrimaryColumn('int', { name: 'id' })
  id: number;

  @Column('int', { name: 'landType' })
  landType: number;

  @Column('int', { name: 'mapInfoType' })
  mapInfoType: number;

  @Column('int', { name: 'sort' })
  sort: number;

  @Column('varchar', { name: 'image', length: 64 })
  image: string;

  @Column('varchar', { name: 'name', length: 64 })
  name: string;

  @Column('varchar', { name: 'description', length: 64 })
  description: string;

  @Column('int', { name: 'positionX' })
  positionX: number;

  @Column('int', { name: 'positionY' })
  positionY: number;

  @Column('int', { name: 'positionZ' })
  positionZ: number;

  @Column('int', { name: 'rotationY' })
  rotationY: number;

  @ManyToOne(() => LandType, (type) => type.MapExposulInfos, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'landType', referencedColumnName: 'type' }])
  LandType: LandType;

  @ManyToOne(() => MapInfoType, (type) => type.MapExposulInfos, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'mapInfoType', referencedColumnName: 'type' }])
  MapInfoType: MapInfoType;

  @ManyToOne(() => Localization, (localization) => localization.MapExposulInfoNames, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'name', referencedColumnName: 'id' }])
  LocalizationName: Localization;

  @ManyToOne(() => Localization, (localization) => localization.MapExposulInfoDescs, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'name', referencedColumnName: 'id' }])
  LocalizationDesc: Localization;

  @OneToMany(() => MapExposulBrand, (mapexposulbrand) => mapexposulbrand.MapExposulInfo)
  MapExposulBrands: MapExposulBrand[];
}

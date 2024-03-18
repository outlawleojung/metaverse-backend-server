import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { MapExposulInfo } from './mapExposulInfo.entity';

@Index('mapExposulInfoId', ['mapExposulInfoId'], {})
@Index('brandName', ['brandName'], {})
@Entity('map_exposul_brand')
export class MapExposulBrand {
  @PrimaryColumn('int', { name: 'mapExposulInfoId' })
  mapExposulInfoId: number;

  @PrimaryColumn('varchar', { name: 'brandName', length: 64 })
  brandName: string;

  @ManyToOne(() => MapExposulInfo, (info) => info.MapExposulBrands, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'mapExposulInfoId', referencedColumnName: 'id' }])
  MapExposulInfo: MapExposulInfo;
}

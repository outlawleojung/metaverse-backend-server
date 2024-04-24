import { Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { MapExposulInfo } from './mapExposulInfo.entity';

@Index('mapExposulInfoId', ['mapExposulInfoId'], {})
@Index('brandName', ['brandName'], {})
@Entity('map_exposul_brand')
export class MapExposulBrand {
  @PrimaryColumn('int')
  mapExposulInfoId: number;

  @PrimaryColumn('varchar', { length: 64 })
  brandName: string;

  @ManyToOne(() => MapExposulInfo, (info) => info.MapExposulBrands, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'mapExposulInfoId' })
  MapExposulInfo: MapExposulInfo;
}

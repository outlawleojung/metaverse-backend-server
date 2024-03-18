import { MediaRollingType } from './mediaRollingType.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { SpaceType } from './spaceType.entity';
import { SpaceDetailType } from './spaceDetailType.entity';
import { BannerReservation } from './bannerReservation.entity';
import { BannerType } from './bannerType.entity';
import { MediaExposureType } from './mediaExposureType.entity';

@Index('spaceType', ['spaceType'], {})
@Index('spaceDetailType', ['spaceDetailType'], {})
@Index('mediaRollingType', ['mediaRollingType'], {})
@Index('bannerType', ['bannerType'], {})
@Entity('banner_info')
export class BannerInfo {
  @PrimaryColumn('int', { name: 'id' })
  id: number;

  @Column('int', { name: 'spaceType' })
  spaceType: number;

  @Column('int', { name: 'spaceDetailType' })
  spaceDetailType: number;

  @Column('varchar', { name: 'positionImage', length: 64 })
  positionImage: string;

  @Column('int', { name: 'width' })
  width: number;

  @Column('int', { name: 'height' })
  height: number;

  @Column('int', { name: 'mediaRollingType' })
  mediaRollingType: number;

  @Column('int', { name: 'bannerType' })
  bannerType: number;

  @Column('int', { name: 'mediaExposureType' })
  mediaExposureType: number;

  @ManyToOne(() => SpaceType, (type) => type.BannerInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'spaceType', referencedColumnName: 'type' }])
  SpaceType: SpaceType;

  @ManyToOne(() => MediaRollingType, (type) => type.BannerInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'mediaRollingType', referencedColumnName: 'type' }])
  MediaRollingType: MediaRollingType;

  @ManyToOne(() => MediaExposureType, (type) => type.BannerInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'mediaExposureType', referencedColumnName: 'type' }])
  MediaExposureType: MediaExposureType;

  @ManyToOne(() => BannerType, (type) => type.BannerInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'bannerType', referencedColumnName: 'type' }])
  BannerType: BannerType;

  @ManyToOne(() => SpaceDetailType, (type) => type.BannerInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'spaceDetailType', referencedColumnName: 'type' }])
  SpaceDetailType: SpaceDetailType;

  @OneToMany(() => BannerReservation, (param) => param.BannerInfo)
  BannerReservations: BannerReservation[];
}

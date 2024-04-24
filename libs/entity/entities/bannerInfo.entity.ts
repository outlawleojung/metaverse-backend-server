import { MediaRollingType } from './mediaRollingType.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
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
  @PrimaryColumn('int')
  id: number;

  @Column('int')
  spaceType: number;

  @Column('int')
  spaceDetailType: number;

  @Column('varchar', { length: 64 })
  positionImage: string;

  @Column('int')
  width: number;

  @Column('int')
  height: number;

  @Column('int')
  mediaRollingType: number;

  @Column('int')
  bannerType: number;

  @Column('int')
  mediaExposureType: number;

  @ManyToOne(() => SpaceType, (type) => type.BannerInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'spaceType' })
  SpaceType: SpaceType;

  @ManyToOne(() => MediaRollingType, (type) => type.BannerInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'mediaRollingType' })
  MediaRollingType: MediaRollingType;

  @ManyToOne(() => MediaExposureType, (type) => type.BannerInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'mediaExposureType' })
  MediaExposureType: MediaExposureType;

  @ManyToOne(() => BannerType, (type) => type.BannerInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'bannerType' })
  BannerType: BannerType;

  @ManyToOne(() => SpaceDetailType, (type) => type.BannerInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'spaceDetailType' })
  SpaceDetailType: SpaceDetailType;

  @OneToMany(() => BannerReservation, (param) => param.BannerInfo)
  BannerReservations: BannerReservation[];
}

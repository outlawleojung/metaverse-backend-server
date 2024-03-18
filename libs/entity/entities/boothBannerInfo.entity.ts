import { MediaRollingType } from './mediaRollingType.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { SpaceType } from './spaceType.entity';
import { SpaceDetailType } from './spaceDetailType.entity';
import { BannerReservation } from './bannerReservation.entity';
import { BannerType } from './bannerType.entity';
import { EachBoothBannerInfo } from './eachBoothBannerInfo.entity';

@Index('spaceType', ['spaceType'], {})
@Index('spaceDetailType', ['spaceDetailType'], {})
@Index('mediaRollingType', ['mediaRollingType'], {})
@Index('bannerType', ['bannerType'], {})
@Entity('booth_banner_info')
export class BoothBannerInfo {
  @PrimaryColumn('int', { name: 'id' })
  id: number;

  @Column('int', { name: 'spaceType' })
  spaceType: number;

  @Column('int', { name: 'spaceDetailType' })
  spaceDetailType: number;

  @Column('int', { name: 'width' })
  width: number;

  @Column('int', { name: 'height' })
  height: number;

  @Column('int', { name: 'mediaRollingType' })
  mediaRollingType: number;

  @Column('int', { name: 'bannerType' })
  bannerType: number;

  @OneToMany(() => EachBoothBannerInfo, (info) => info.BoothBannerInfo)
  EachBoothBannerInfos: EachBoothBannerInfo[];

  @ManyToOne(() => SpaceType, (type) => type.BoothBannerInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'spaceType', referencedColumnName: 'type' }])
  SpaceType: SpaceType;

  @ManyToOne(() => MediaRollingType, (type) => type.BoothBannerInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'mediaRollingType', referencedColumnName: 'type' }])
  MediaRollingType: MediaRollingType;

  @ManyToOne(() => BannerType, (type) => type.BoothBannerInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'bannerType', referencedColumnName: 'type' }])
  BannerType: BannerType;

  @ManyToOne(() => SpaceDetailType, (type) => type.BoothBannerInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'spaceDetailType', referencedColumnName: 'type' }])
  SpaceDetailType: SpaceDetailType;
}

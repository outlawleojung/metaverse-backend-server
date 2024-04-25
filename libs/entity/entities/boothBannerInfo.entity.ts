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
import { BannerType } from './bannerType.entity';
import { EachBoothBannerInfo } from './eachBoothBannerInfo.entity';

@Index('spaceType', ['spaceType'], {})
@Index('spaceDetailType', ['spaceDetailType'], {})
@Index('mediaRollingType', ['mediaRollingType'], {})
@Index('bannerType', ['bannerType'], {})
@Entity('booth_banner_info')
export class BoothBannerInfo {
  @PrimaryColumn('int')
  id: number;

  @Column('int')
  spaceType: number;

  @Column('int')
  spaceDetailType: number;

  @Column('int')
  width: number;

  @Column('int')
  height: number;

  @Column('int')
  mediaRollingType: number;

  @Column('int')
  bannerType: number;

  @OneToMany(() => EachBoothBannerInfo, (info) => info.BoothBannerInfo)
  EachBoothBannerInfos: EachBoothBannerInfo[];

  @ManyToOne(() => SpaceType, (type) => type.BoothBannerInfos, {
    onUpdate: 'CASCADE',
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'spaceType' })
  SpaceType: SpaceType;

  @ManyToOne(() => MediaRollingType, (type) => type.BoothBannerInfos, {
    onUpdate: 'CASCADE',
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'mediaRollingType' })
  MediaRollingType: MediaRollingType;

  @ManyToOne(() => BannerType, (type) => type.BoothBannerInfos, {
    onUpdate: 'CASCADE',
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'bannerType' })
  BannerType: BannerType;

  @ManyToOne(() => SpaceDetailType, (type) => type.BoothBannerInfos, {
    onUpdate: 'CASCADE',
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'spaceDetailType' })
  SpaceDetailType: SpaceDetailType;
}

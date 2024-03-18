import { Entity, OneToMany } from 'typeorm';
import { ScreenInfo } from './screenInfo.entity';
import { BannerInfo } from './bannerInfo.entity';
import { SpaceInfo } from './spaceInfo.entity';
import { BoothScreenInfo } from './boothScreenInfo.entity';
import { BoothBannerInfo } from './boothBannerInfo.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('space_detail_type')
export class SpaceDetailType extends BaseTypeEntity {
  @OneToMany(() => ScreenInfo, (info) => info.SpaceDetailType)
  ScreenInfos: ScreenInfo[];

  @OneToMany(() => BoothScreenInfo, (info) => info.SpaceDetailType)
  BoothScreenInfos: BoothScreenInfo[];

  @OneToMany(() => BannerInfo, (info) => info.SpaceDetailType)
  BannerInfos: BannerInfo[];

  @OneToMany(() => BoothBannerInfo, (info) => info.SpaceDetailType)
  BoothBannerInfos: BoothBannerInfo[];

  @OneToMany(() => SpaceInfo, (info) => info.SpaceDetailType)
  SpaceInfo: SpaceInfo[];
}

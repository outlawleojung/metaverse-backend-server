import { Entity, OneToMany } from 'typeorm';
import { ScreenInfo } from './screenInfo.entity';
import { BannerInfo } from './bannerInfo.entity';
import { SpaceInfo } from './spaceInfo.entity';
import { BoothScreenInfo } from './boothScreenInfo.entity';
import { BoothBannerInfo } from './boothBannerInfo.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('space_type')
export class SpaceType extends BaseTypeEntity {
  @OneToMany(() => ScreenInfo, (info) => info.SpaceType)
  ScreenInfos: ScreenInfo[];

  @OneToMany(() => BoothScreenInfo, (info) => info.SpaceType)
  BoothScreenInfos: BoothScreenInfo[];

  @OneToMany(() => BannerInfo, (info) => info.SpaceType)
  BannerInfos: BannerInfo[];

  @OneToMany(() => BoothBannerInfo, (info) => info.SpaceType)
  BoothBannerInfos: BoothBannerInfo[];

  @OneToMany(() => SpaceInfo, (info) => info.SpaceType)
  SpaceInfos: SpaceInfo[];
}

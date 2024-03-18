import { Entity, OneToMany } from 'typeorm';
import { BannerInfo } from './bannerInfo.entity';
import { ScreenInfo } from './screenInfo.entity';
import { BoothBannerInfo } from './boothBannerInfo.entity';
import { BoothScreenInfo } from './boothScreenInfo.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('media_rolling_type')
export class MediaRollingType extends BaseTypeEntity {
  @OneToMany(() => BannerInfo, (banner) => banner.MediaRollingType)
  BannerInfos: BannerInfo[];

  @OneToMany(() => BoothBannerInfo, (banner) => banner.MediaRollingType)
  BoothBannerInfos: BoothBannerInfo[];

  @OneToMany(() => ScreenInfo, (banner) => banner.MediaRollingType)
  ScreenInfos: ScreenInfo[];

  @OneToMany(() => BoothScreenInfo, (banner) => banner.MediaRollingType)
  BoothScreenInfos: BoothScreenInfo[];
}

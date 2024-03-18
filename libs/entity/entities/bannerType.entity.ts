import { Entity, OneToMany } from 'typeorm';
import { BannerInfo } from './bannerInfo.entity';
import { BoothBannerInfo } from './boothBannerInfo.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('banner_type')
export class BannerType extends BaseTypeEntity {
  @OneToMany(() => BannerInfo, (banner) => banner.BannerType)
  BannerInfos: BannerInfo[];

  @OneToMany(() => BoothBannerInfo, (banner) => banner.BannerType)
  BoothBannerInfos: BoothBannerInfo[];
}

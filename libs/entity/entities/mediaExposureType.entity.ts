import { Entity, OneToMany } from 'typeorm';
import { BannerInfo } from './bannerInfo.entity';
import { ScreenInfo } from './screenInfo.entity';
import { AzureStorage } from './azureStorage.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('media_exposure_type')
export class MediaExposureType extends BaseTypeEntity {
  @OneToMany(() => BannerInfo, (banner) => banner.MediaExposureType)
  BannerInfos: BannerInfo[];

  @OneToMany(() => ScreenInfo, (banner) => banner.MediaExposureType)
  ScreenInfos: ScreenInfo[];

  @OneToMany(() => AzureStorage, (storage) => storage.MediaExposureType)
  AzureStorages: AzureStorage[];
}

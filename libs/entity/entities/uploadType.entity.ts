import { Entity, OneToMany } from 'typeorm';
import { MemberFrameImage } from './memberFrameImage.entity';
import { BannerReservation } from './bannerReservation.entity';
import { EachBoothScreenInfo } from './eachBoothScreenInfo.entity';
import { EachBoothBannerInfo } from './eachBoothBannerInfo.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('upload_type')
export class UploadType extends BaseTypeEntity {
  @OneToMany(() => MemberFrameImage, (image) => image.UploadType)
  MemberFrameImages: MemberFrameImage[];

  @OneToMany(() => BannerReservation, (param) => param.UploadType)
  BannerReservations: BannerReservation[];

  @OneToMany(() => EachBoothScreenInfo, (info) => info.UploadType)
  EachBoothScreenInfos: EachBoothScreenInfo[];

  @OneToMany(() => EachBoothBannerInfo, (info) => info.UploadType)
  EachBoothBannerInfos: EachBoothBannerInfo[];
}

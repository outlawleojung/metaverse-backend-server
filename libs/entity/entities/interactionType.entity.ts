import { Entity, OneToMany } from 'typeorm';
import { EachBoothBannerInfo } from './eachBoothBannerInfo.entity';
import { EachBoothScreenInfo } from './eachBoothScreenInfo.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('interaction_type')
export class InteractionType extends BaseTypeEntity {
  @OneToMany(() => EachBoothScreenInfo, (info) => info.InteractionType)
  EachBoothScreenInfos: EachBoothScreenInfo[];

  @OneToMany(() => EachBoothScreenInfo, (info) => info.InteractionType)
  EachBoothBannerInfos: EachBoothBannerInfo[];
}

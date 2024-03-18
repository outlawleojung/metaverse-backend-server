import { Entity, OneToMany } from 'typeorm';
import { VideoPlayInfo } from './videoPlayInfo.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('enabled_type')
export class EnabledType extends BaseTypeEntity {
  @OneToMany(() => VideoPlayInfo, (videoplayinfo) => videoplayinfo.EnabledType)
  VideoPlayInfos: VideoPlayInfo[];
}

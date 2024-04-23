import { Entity, OneToMany } from 'typeorm';
import { VideoPlayInfo } from './videoPlayInfo.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('video_state_type')
export class VideoStateType extends BaseTypeEntity {
  @OneToMany(
    () => VideoPlayInfo,
    (videoplayinfo) => videoplayinfo.VideoStateType,
  )
  VideoPlayInfos: VideoPlayInfo[];
}

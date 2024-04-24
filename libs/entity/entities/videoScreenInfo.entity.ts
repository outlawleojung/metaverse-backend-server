import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { VideoPlayInfo } from './videoPlayInfo.entity';
import { AreaType } from './areaType.entity';
import { WorldType } from './worldType.entity';
import { VideoScreenStats } from './videoScreenStats.entity';

@Index('areaType', ['areaType'], {})
@Index('worldType', ['worldType'], {})
@Entity('video_screen_info')
export class VideoScreenInfo {
  @PrimaryColumn('int')
  id: number;

  @Column('int')
  worldType: number;

  @Column('int')
  areaType: number;

  @Column('varchar', { length: 256 })
  screenName: string;

  @OneToOne(
    () => VideoPlayInfo,
    (videoplayinfo) => videoplayinfo.VideoScreenInfo,
  )
  VideoPlayInfo: VideoPlayInfo;

  @ManyToOne(() => AreaType, (areatype) => areatype.VideoScreenInfos, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'areaType' })
  AreaType: AreaType;

  @ManyToOne(() => WorldType, (worldtype) => worldtype.VideoScreenInfos, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'worldType' })
  WorldType: WorldType;

  @OneToMany(
    () => VideoScreenStats,
    (videoscreenstats) => videoscreenstats.VideoScreenInfo,
  )
  VideoScreenStats: VideoScreenStats[];
}

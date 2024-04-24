import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VideoScreenInfo } from './videoScreenInfo.entity';
import { BaseModelEntity } from './baseModelEntity.entity';

@Index('videoScreenId', ['videoScreenId'], {})
@Entity('video_screen_stats')
export class VideoScreenStats extends BaseModelEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column('int')
  videoScreenId: number;

  @Column('int')
  playTime: number;

  @ManyToOne(
    () => VideoScreenInfo,
    (videoscreeninfo) => videoscreeninfo.VideoScreenStats,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'videoScreenId' })
  VideoScreenInfo: VideoScreenInfo;
}

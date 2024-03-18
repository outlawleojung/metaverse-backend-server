import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { VideoScreenInfo } from './videoScreenInfo.entity';

@Index('videoScreenId', ['videoScreenId'], {})
@Entity('video_screen_stats')
export class VideoScreenStats {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'videoScreenId' })
  videoScreenId: number;

  @Column('int', { name: 'playTime' })
  playTime: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => VideoScreenInfo, (videoscreeninfo) => videoscreeninfo.VideoScreenStats, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'videoScreenId', referencedColumnName: 'id' }])
  VideoScreenInfo: VideoScreenInfo;
}

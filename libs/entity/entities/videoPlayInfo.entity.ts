import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { VideoScreenInfo } from './videoScreenInfo.entity';
import { VideoStateType } from './videoStateType.entity';
import { EnabledType } from './enabledType.entity';
import { User } from './user.entity';

@Index('videoPlayType', ['videoPlayType'], {})
@Index('enabledType', ['enabledType'], {})
@Index('adminId', ['adminId'], {})
@Entity('video_play_info')
export class VideoPlayInfo {
  @PrimaryColumn('int', { name: 'videoScreenType' })
  videoScreenType: number;

  @Column('int', { name: 'videoPlayType' })
  videoPlayType: number;

  @Column('int', { name: 'enabledType' })
  enabledType: number;

  @Column('longtext', { name: 'playList', nullable: true })
  playList: string | null;

  @Column('longtext', { name: 'liveLink', nullable: true })
  liveLink: string | null;

  @Column('longtext', { name: 'liveLink2', nullable: true })
  liveLink2: string | null;

  @Column('datetime', { name: 'startDate', nullable: true })
  startDate: Date | null;

  @Column('datetime', { name: 'endDate', nullable: true })
  endDate: Date | null;

  @Column('int', { name: 'adminId', nullable: true })
  adminId: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => VideoScreenInfo, (videoscreeninfo) => videoscreeninfo.VideoPlayInfo, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'videoScreenType', referencedColumnName: 'id' }])
  VideoScreenInfo: VideoScreenInfo;

  @ManyToOne(() => VideoStateType, (videostatetype) => videostatetype.VideoPlayInfos, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'videoPlayType', referencedColumnName: 'type' }])
  VideoStateType: VideoStateType;

  @ManyToOne(() => EnabledType, (enabledtype) => enabledtype.VideoPlayInfos, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'enabledType', referencedColumnName: 'type' }])
  EnabledType: EnabledType;

  @ManyToOne(() => User, (user) => user.VideoPlayInfos, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'adminId', referencedColumnName: 'id' }])
  Admin: User;
}

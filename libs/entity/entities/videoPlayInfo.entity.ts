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
import { Admin } from './admin.entity';

@Index('videoPlayType', ['videoPlayType'], {})
@Index('enabledType', ['enabledType'], {})
@Index('adminId', ['adminId'], {})
@Entity('video_play_info')
export class VideoPlayInfo {
  @PrimaryColumn('int')
  videoScreenType: number;

  @Column('int')
  videoPlayType: number;

  @Column('int')
  enabledType: number;

  @Column('longtext', { nullable: true })
  playList: string | null;

  @Column('longtext', { nullable: true })
  liveLink: string | null;

  @Column('longtext', { nullable: true })
  liveLink2: string | null;

  @Column('datetime', { nullable: true })
  startDate: Date | null;

  @Column('datetime', { nullable: true })
  endDate: Date | null;

  @Column('int', { nullable: true })
  adminId: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(
    () => VideoScreenInfo,
    (videoscreeninfo) => videoscreeninfo.VideoPlayInfo,
    {
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'videoScreenType' })
  VideoScreenInfo: VideoScreenInfo;

  @ManyToOne(
    () => VideoStateType,
    (videostatetype) => videostatetype.VideoPlayInfos,
    {
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'videoPlayType' })
  VideoStateType: VideoStateType;

  @ManyToOne(() => EnabledType, (enabledtype) => enabledtype.VideoPlayInfos, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'enabledType' })
  EnabledType: EnabledType;

  @ManyToOne(() => Admin, (admin) => admin.VideoPlayInfos, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  admin: Admin;
}

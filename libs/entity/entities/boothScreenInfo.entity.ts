import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { SpaceType } from './spaceType.entity';
import { SpaceDetailType } from './spaceDetailType.entity';
import { MediaRollingType } from './mediaRollingType.entity';
import { EachBoothScreenInfo } from './eachBoothScreenInfo.entity';

@Index('spaceType', ['spaceType'], {})
@Index('spaceDetailType', ['spaceDetailType'], {})
@Index('mediaRollingType', ['mediaRollingType'], {})
@Entity('booth_screen_info')
export class BoothScreenInfo {
  @PrimaryColumn('int')
  id: number;

  @Column('int')
  spaceType: number;

  @Column('int')
  spaceDetailType: number;

  @Column('varchar', { length: 64 })
  description: string;

  @Column('int')
  width: number;

  @Column('int')
  height: number;

  @Column('int')
  mediaRollingType: number;

  @OneToMany(() => EachBoothScreenInfo, (info) => info.BoothScreenInfo)
  EachBoothScreenInfos: EachBoothScreenInfo[];

  @ManyToOne(() => SpaceType, (type) => type.BoothScreenInfos, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'spaceType' })
  SpaceType: SpaceType;

  @ManyToOne(() => MediaRollingType, (type) => type.BoothScreenInfos, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'mediaRollingType' })
  MediaRollingType: MediaRollingType;

  @ManyToOne(() => SpaceDetailType, (type) => type.BoothScreenInfos, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'spaceDetailType' })
  SpaceDetailType: SpaceDetailType;
}

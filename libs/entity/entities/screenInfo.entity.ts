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
import { ScreenReservation } from './screenReservation.entity';
import { MediaRollingType } from './mediaRollingType.entity';
import { MediaExposureType } from './mediaExposureType.entity';

@Index('spaceType', ['spaceType'], {})
@Index('spaceDetailType', ['spaceDetailType'], {})
@Index('mediaRollingType', ['mediaRollingType'], {})
@Entity('screen_info')
export class ScreenInfo {
  @PrimaryColumn('int')
  id: number;

  @Column('int')
  spaceType: number;

  @Column('int')
  spaceDetailType: number;

  @Column('varchar', { length: 64 })
  description: string;

  @Column('varchar', { length: 64 })
  positionImage: string;

  @Column('int')
  width: number;

  @Column('int')
  height: number;

  @Column('int')
  mediaRollingType: number;

  @Column('int')
  mediaExposureType: number;

  @OneToMany(() => ScreenReservation, (param) => param.ScreenInfo)
  ScreenReservations: ScreenReservation[];

  @ManyToOne(() => SpaceType, (type) => type.ScreenInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'spaceType' })
  SpaceType: SpaceType;

  @ManyToOne(() => MediaRollingType, (type) => type.ScreenInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'mediaRollingType' })
  MediaRollingType: MediaRollingType;

  @ManyToOne(() => MediaExposureType, (type) => type.ScreenInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'mediaExposureType' })
  MediaExposureType: MediaExposureType;

  @ManyToOne(() => SpaceDetailType, (type) => type.ScreenInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'spaceDetailType' })
  SpaceDetailType: SpaceDetailType;
}

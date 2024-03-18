import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
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
  @PrimaryColumn('int', { name: 'id' })
  id: number;

  @Column('int', { name: 'spaceType' })
  spaceType: number;

  @Column('int', { name: 'spaceDetailType' })
  spaceDetailType: number;

  @Column('varchar', { name: 'description', length: 64 })
  description: string;

  @Column('varchar', { name: 'positionImage', length: 64 })
  positionImage: string;

  @Column('int', { name: 'width' })
  width: number;

  @Column('int', { name: 'height' })
  height: number;

  @Column('int', { name: 'mediaRollingType' })
  mediaRollingType: number;

  @Column('int', { name: 'mediaExposureType' })
  mediaExposureType: number;

  @OneToMany(() => ScreenReservation, (param) => param.ScreenInfo)
  ScreenReservations: ScreenReservation[];

  @ManyToOne(() => SpaceType, (type) => type.ScreenInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'spaceType', referencedColumnName: 'type' }])
  SpaceType: SpaceType;

  @ManyToOne(() => MediaRollingType, (type) => type.ScreenInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'mediaRollingType', referencedColumnName: 'type' }])
  MediaRollingType: MediaRollingType;

  @ManyToOne(() => MediaExposureType, (type) => type.ScreenInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'mediaExposureType', referencedColumnName: 'type' }])
  MediaExposureType: MediaExposureType;

  @ManyToOne(() => SpaceDetailType, (type) => type.ScreenInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'spaceDetailType', referencedColumnName: 'type' }])
  SpaceDetailType: SpaceDetailType;
}

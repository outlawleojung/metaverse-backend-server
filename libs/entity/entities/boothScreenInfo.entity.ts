import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { SpaceType } from './spaceType.entity';
import { SpaceDetailType } from './spaceDetailType.entity';
import { ScreenReservation } from './screenReservation.entity';
import { SpaceInfo } from './spaceInfo.entity';
import { MediaRollingType } from './mediaRollingType.entity';
import { EachBoothScreenInfo } from './eachBoothScreenInfo.entity';

@Index('spaceType', ['spaceType'], {})
@Index('spaceDetailType', ['spaceDetailType'], {})
@Index('mediaRollingType', ['mediaRollingType'], {})
@Entity('booth_screen_info')
export class BoothScreenInfo {
  @PrimaryColumn('int', { name: 'id' })
  id: number;

  @Column('int', { name: 'spaceType' })
  spaceType: number;

  @Column('int', { name: 'spaceDetailType' })
  spaceDetailType: number;

  @Column('varchar', { name: 'description', length: 64 })
  description: string;

  @Column('int', { name: 'width' })
  width: number;

  @Column('int', { name: 'height' })
  height: number;

  @Column('int', { name: 'mediaRollingType' })
  mediaRollingType: number;

  @OneToMany(() => EachBoothScreenInfo, (info) => info.BoothScreenInfo)
  EachBoothScreenInfos: EachBoothScreenInfo[];

  @ManyToOne(() => SpaceType, (type) => type.BoothScreenInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'spaceType', referencedColumnName: 'type' }])
  SpaceType: SpaceType;

  @ManyToOne(() => MediaRollingType, (type) => type.BoothScreenInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'mediaRollingType', referencedColumnName: 'type' }])
  MediaRollingType: MediaRollingType;

  @ManyToOne(() => SpaceDetailType, (type) => type.BoothScreenInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'spaceDetailType', referencedColumnName: 'type' }])
  SpaceDetailType: SpaceDetailType;
}

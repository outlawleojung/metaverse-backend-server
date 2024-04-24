import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { SpaceDetailType } from './spaceDetailType.entity';
import { SpaceType } from './spaceType.entity';

@Entity('space_info')
export class SpaceInfo {
  @PrimaryColumn('int')
  spaceType: number;

  @PrimaryColumn('int')
  spaceDetailType: number;

  @ManyToOne(() => SpaceType, (info) => info.SpaceInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'spaceType' })
  SpaceType: SpaceType;

  @ManyToOne(() => SpaceDetailType, (type) => type.SpaceInfo, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'spaceDetailType' })
  SpaceDetailType: SpaceDetailType;
}

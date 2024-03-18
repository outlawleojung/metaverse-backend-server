import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { SpaceDetailType } from './spaceDetailType.entity';
import { SpaceType } from './spaceType.entity';

@Entity('space_info')
export class SpaceInfo {
  @PrimaryColumn('int', { name: 'spaceType' })
  spaceType: number;

  @PrimaryColumn('int', { name: 'spaceDetailType' })
  spaceDetailType: number;

  @ManyToOne(() => SpaceType, (info) => info.SpaceInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'spaceType', referencedColumnName: 'type' }])
  SpaceType: SpaceType;

  @ManyToOne(() => SpaceDetailType, (type) => type.SpaceInfo, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'spaceDetailType', referencedColumnName: 'type' }])
  SpaceDetailType: SpaceDetailType;
}

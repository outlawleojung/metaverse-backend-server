import { Entity, OneToMany } from 'typeorm';
import { NpcArrange } from './npcArrange.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('scene_type')
export class SceneType extends BaseTypeEntity {
  @OneToMany(() => NpcArrange, (npcarrange) => npcarrange.SceneType)
  NpcArranges: NpcArrange[];
}

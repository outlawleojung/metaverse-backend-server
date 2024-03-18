import { Entity, OneToMany } from 'typeorm';
import { NpcList } from './npcList.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('npc_look_type')
export class NpcLookType extends BaseTypeEntity {
  @OneToMany(() => NpcList, (npc) => npc.NpcLookType)
  NpcLists: NpcList[];
}

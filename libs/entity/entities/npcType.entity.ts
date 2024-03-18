import { Entity, OneToMany } from 'typeorm';
import { NpcList } from './npcList.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('npc_type')
export class NpcType extends BaseTypeEntity {
  @OneToMany(() => NpcList, (npc) => npc.NpcType)
  NpcLists: NpcList[];
}

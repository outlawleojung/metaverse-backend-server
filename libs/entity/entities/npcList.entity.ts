import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { NpcArrange } from './npcArrange.entity';
import { NpcType } from './npcType.entity';
import { NpcLookType } from './npcLookType.entity';
import { Localization } from './localization.entity';
import { NpcCostume } from './npcCostume.entity';

@Index('npcType', ['npcType'], {})
@Index('npcLookType', ['npcLookType'], {})
@Index('name', ['name'], {})
@Entity('npc_list')
export class NpcList {
  @PrimaryColumn('int')
  id: number;

  @Column('int')
  npcType: number;

  @Column('int')
  npcLookType: number;

  @Column('varchar', { length: 64 })
  name: string;

  @Column('varchar', { length: 64 })
  prefab: string;

  @OneToMany(() => NpcArrange, (npcarrange) => npcarrange.NpcList)
  NpcArranges: NpcArrange[];

  @OneToMany(() => NpcCostume, (npccostume) => npccostume.NpcList)
  NpcCostumes: NpcCostume[];

  @ManyToOne(() => NpcType, (type) => type.NpcLists, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'npcType' })
  NpcType: NpcType;

  @ManyToOne(() => NpcLookType, (type) => type.NpcLists, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'npcLookType' })
  NpcLookType: NpcLookType;

  @ManyToOne(() => Localization, (local) => local.NpcLists, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'name' })
  LocalizationName: Localization;
}

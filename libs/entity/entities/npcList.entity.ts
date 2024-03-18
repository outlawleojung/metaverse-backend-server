import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
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
  @PrimaryColumn('int', { name: 'id' })
  id: number;

  @Column('int', { name: 'npcType' })
  npcType: number;

  @Column('int', { name: 'npcLookType' })
  npcLookType: number;

  @Column('varchar', { name: 'name', length: 64 })
  name: string;

  @Column('varchar', { name: 'prefab', length: 64 })
  prefab: string;

  @OneToMany(() => NpcArrange, (npcarrange) => npcarrange.NpcList)
  NpcArranges: NpcArrange[];

  @OneToMany(() => NpcCostume, (npccostume) => npccostume.NpcList)
  NpcCostumes: NpcCostume[];

  @ManyToOne(() => NpcType, (type) => type.NpcLists, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'npcType', referencedColumnName: 'type' }])
  NpcType: NpcType;

  @ManyToOne(() => NpcLookType, (type) => type.NpcLists, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'npcLookType', referencedColumnName: 'type' }])
  NpcLookType: NpcLookType;

  @ManyToOne(() => Localization, (local) => local.NpcLists, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'name', referencedColumnName: 'id' }])
  LocalizationName: Localization;
}

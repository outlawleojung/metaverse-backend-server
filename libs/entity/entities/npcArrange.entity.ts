import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { NpcList } from './npcList.entity';
import { SceneType } from './sceneType.entity';

@Index('sceneType', ['sceneType'], {})
@Entity('npc_arrange')
export class NpcArrange {
  @PrimaryColumn('int', { name: 'npcId' })
  npcId: number;

  @Column('int', { name: 'sceneType' })
  sceneType: number;

  @Column('int', { name: 'positionX' })
  positionX: number;

  @Column('int', { name: 'positionY' })
  positionY: number;

  @Column('int', { name: 'positionZ' })
  positionZ: number;

  @Column('int', { name: 'rotationY' })
  rotationY: number;

  @Column('varchar', { name: 'animation', length: 64 })
  animation: string;

  @ManyToOne(() => NpcList, (npc) => npc.NpcArranges, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'npcId', referencedColumnName: 'id' }])
  NpcList: NpcList;

  @ManyToOne(() => SceneType, (type) => type.NpcArranges, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'sceneType', referencedColumnName: 'type' }])
  SceneType: SceneType;
}

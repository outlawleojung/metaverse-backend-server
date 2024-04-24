import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { NpcList } from './npcList.entity';
import { SceneType } from './sceneType.entity';

@Index('sceneType', ['sceneType'], {})
@Entity('npc_arrange')
export class NpcArrange {
  @PrimaryColumn('int')
  npcId: number;

  @Column('int')
  sceneType: number;

  @Column('int')
  positionX: number;

  @Column('int')
  positionY: number;

  @Column('int')
  positionZ: number;

  @Column('int')
  rotationY: number;

  @Column('varchar', { length: 64 })
  animation: string;

  @ManyToOne(() => NpcList, (npc) => npc.NpcArranges, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'npcId' })
  NpcList: NpcList;

  @ManyToOne(() => SceneType, (type) => type.NpcArranges, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'sceneType' })
  SceneType: SceneType;
}

import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { NpcList } from './npcList.entity';
import { AvatarPartsType } from './avatarPartsType.entity';
import { Item } from './item.entity';

@Index('partsType', ['partsType'], {})
@Index('itemId', ['itemId'], {})
@Entity('npc_costume')
export class NpcCostume {
  @PrimaryColumn('int', { name: 'npcId' })
  npcId: number;

  @PrimaryColumn('int', { name: 'partsType' })
  partsType: number;

  @Column('int', { name: 'itemId' })
  itemId: number;

  @ManyToOne(() => NpcList, (npc) => npc.NpcCostumes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'npcId', referencedColumnName: 'id' }])
  NpcList: NpcList;

  @ManyToOne(() => AvatarPartsType, (type) => type.NpcCostumes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'partsType', referencedColumnName: 'type' }])
  AvatarPartsType: AvatarPartsType;

  @ManyToOne(() => Item, (item) => item.NpcCostumes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'itemId', referencedColumnName: 'id' }])
  Item: Item;
}

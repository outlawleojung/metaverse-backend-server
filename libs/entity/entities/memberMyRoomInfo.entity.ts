import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { LayerType } from './layerType.entity';
import { ApiProperty } from '@nestjs/swagger';
import { MemberFurnitureItemInven } from './memberFurnitureItemInven.entity';

@Index('itemId', ['itemId'], {})
@Index('memberId', ['memberId'], {})
@Index('memberId_itemId_num', ['memberId', 'itemId', 'num'], {})
@Index('layerType', ['layerType'], {})
@Entity('member_my_room_info')
export class MemberMyRoomInfo {
  @Column('uuid')
  memberId: string;

  @ApiProperty({
    example: 110001,
    description: '아이템 아이디',
    required: true,
  })
  @PrimaryColumn('int', { name: 'itemId' })
  itemId: number;

  @ApiProperty({
    example: 12,
    description: '아이템 번호',
  })
  @PrimaryColumn('int', { name: 'num' })
  num: number;

  @ApiProperty({
    example: 1,
    description: '레이어 타입',
    required: true,
  })
  @Column('int', { name: 'layerType' })
  layerType: number;

  @ApiProperty({
    example: 12,
    description: 'x 좌표',
    required: true,
  })
  @Column('int', { name: 'x' })
  x: number;

  @ApiProperty({
    example: 8,
    description: 'y 좌표',
    required: true,
  })
  @Column('int', { name: 'y' })
  y: number;

  @ApiProperty({
    example: 72,
    description: '회전',
    required: true,
  })
  @Column('int', { name: 'rotation' })
  rotation: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(
    () => MemberFurnitureItemInven,
    (inven) => inven.MemberMyRoomInfos,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn([
    { name: 'memberId', referencedColumnName: 'memberId' },
    { name: 'itemId', referencedColumnName: 'itemId' },
    { name: 'num', referencedColumnName: 'num' },
  ])
  MemberFurnitureItemInven: MemberFurnitureItemInven;

  @ManyToOne(() => LayerType, (layertype) => layertype.MemberMyRoomInfos, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'layerType', referencedColumnName: 'type' }])
  LayerType: LayerType;
}

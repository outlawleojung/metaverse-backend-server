import {
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Member } from './member.entity';
import { Item } from './item.entity';
import { MemberMyRoomInfo } from './memberMyRoomInfo.entity';
import { MemberFrameImage } from './memberFrameImage.entity';

@Index('itemId', ['itemId'], {})
@Entity('member_furniture_item_inven')
export class MemberFurnitureItemInven {
  @PrimaryColumn('uuid')
  memberId: string;

  @PrimaryColumn('int')
  itemId: number;

  @PrimaryColumn('int', { default: 1 })
  num: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => MemberFrameImage, (image) => image.MemberFurnitureItemInven)
  MemberFrameImage: MemberFrameImage;

  @ManyToOne(() => Member, (member) => member.MemberFurnitureItemInvens, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'memberId' })
  Member: Member;

  @ManyToOne(() => Item, (item) => item.MemberFurnitureItemInvens, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'itemId' })
  Item: Item;

  @OneToMany(
    () => MemberMyRoomInfo,
    (membermyroominfo) => membermyroominfo.MemberFurnitureItemInven,
  )
  MemberMyRoomInfos: MemberMyRoomInfo[];
}

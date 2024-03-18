import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MemberFurnitureItemInven } from './memberFurnitureItemInven.entity';
import { UploadType } from './uploadType.entity';

@Index('memberId', ['memberId'], {})
@Index('itemId', ['itemId'], {})
@Index('num', ['num'], {})
@Index('uploadType', ['uploadType'], {})
@Entity('member_frame_image')
export class MemberFrameImage {
  @PrimaryColumn('varchar', { name: 'memberId', length: 100 })
  memberId: string;

  @PrimaryColumn('int', { name: 'itemId' })
  itemId: number;

  @PrimaryColumn('int', { name: 'num' })
  num: number;

  @Column('int', { name: 'uploadType' })
  uploadType: number;

  @Column('text', { name: 'imageName' })
  imageName: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => MemberFurnitureItemInven, (member) => member.MemberFrameImage, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([
    { name: 'memberId', referencedColumnName: 'memberId' },
    { name: 'itemId', referencedColumnName: 'itemId' },
    { name: 'num', referencedColumnName: 'num' },
  ])
  MemberFurnitureItemInven: MemberFurnitureItemInven;

  @ManyToOne(() => UploadType, (type) => type.MemberFrameImages, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'uploadType', referencedColumnName: 'type' }])
  UploadType: UploadType;
}

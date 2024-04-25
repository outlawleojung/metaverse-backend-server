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

@Index('uploadType', ['uploadType'], {})
@Entity('member_frame_image')
export class MemberFrameImage {
  @PrimaryColumn('uuid')
  memberId: string;

  @PrimaryColumn('int')
  itemId: number;

  @PrimaryColumn('int')
  num: number;

  @Column('int')
  uploadType: number;

  @Column('text')
  imageName: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(
    () => MemberFurnitureItemInven,
    (member) => member.MemberFrameImage,
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

  @ManyToOne(() => UploadType, (type) => type.MemberFrameImages, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'uploadType' })
  UploadType: UploadType;
}

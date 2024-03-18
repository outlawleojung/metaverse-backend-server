import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { BannerInfo } from './bannerInfo.entity';
import { UploadType } from './uploadType.entity';

@Index('bannerId', ['bannerId'], {})
@Index('uploadType', ['uploadType'], {})
@Index('adminId', ['adminId'], {})
@Entity('banner_reservation')
export class BannerReservation {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'bannerId' })
  bannerId: number;

  @Column('int', { name: 'uploadType' })
  uploadType: number;

  @Column('text', { name: 'contents' })
  contents: string;

  @Column('varchar', { name: 'description', length: 64, nullable: true })
  description: string;

  @Column('int', { name: 'adminId', nullable: true })
  adminId: number;

  @Column('datetime', { name: 'startedAt' })
  startedAt: Date;

  @Column('datetime', { name: 'endedAt' })
  endedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => BannerInfo, (info) => info.BannerReservations, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'bannerId', referencedColumnName: 'id' }])
  BannerInfo: BannerInfo;

  @ManyToOne(() => UploadType, (type) => type.BannerReservations, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'uploadType', referencedColumnName: 'type' }])
  UploadType: UploadType;

  @ManyToOne(() => User, (user) => user.BannerReservations, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'adminId', referencedColumnName: 'id' }])
  Admin: User;
}

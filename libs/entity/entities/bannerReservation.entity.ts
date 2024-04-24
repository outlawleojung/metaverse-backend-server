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
import { BannerInfo } from './bannerInfo.entity';
import { UploadType } from './uploadType.entity';
import { Admin } from './admin.entity';
import { BaseModelEntity } from './baseModelEntity.entity';

@Index('bannerId', ['bannerId'], {})
@Index('uploadType', ['uploadType'], {})
@Index('adminId', ['adminId'], {})
@Entity('banner_reservation')
export class BannerReservation extends BaseModelEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column('int')
  bannerId: number;

  @Column('int')
  uploadType: number;

  @Column('text')
  contents: string;

  @Column('varchar', { length: 64, nullable: true })
  description: string | null;

  @Column({ nullable: true })
  adminId: number | null;

  @Column('datetime')
  startedAt: Date;

  @Column('datetime')
  endedAt: Date;

  @ManyToOne(() => BannerInfo, (info) => info.BannerReservations, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'bannerId' })
  BannerInfo: BannerInfo;

  @ManyToOne(() => UploadType, (type) => type.BannerReservations, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'uploadType' })
  UploadType: UploadType;

  @ManyToOne(() => Admin, (admin) => admin.BannerReservations, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'adminId' })
  admin: Admin;
}

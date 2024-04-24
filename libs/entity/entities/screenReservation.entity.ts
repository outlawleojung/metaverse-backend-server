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
import { ScreenContentType } from './screenContentType.entity';
import { ScreenInfo } from './screenInfo.entity';
import { Admin } from './admin.entity';
import { BaseModelEntity } from './baseModelEntity.entity';

@Index('screenId', ['screenId'], {})
@Index('screenContentType', ['screenContentType'], {})
@Index('adminId', ['adminId'], {})
@Entity('screen_reservation')
export class ScreenReservation extends BaseModelEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column('int')
  screenId: number;

  @Column('int')
  screenContentType: number;

  @Column('text')
  contents: string;

  @Column('varchar', { length: 64, nullable: true })
  description: string;

  @Column({ nullable: true })
  adminId: number | null;

  @Column('datetime')
  startedAt: Date;

  @Column('datetime')
  endedAt: Date;

  @ManyToOne(() => ScreenInfo, (info) => info.ScreenReservations, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'screenId' })
  ScreenInfo: ScreenInfo;

  @ManyToOne(() => ScreenContentType, (type) => type.ScreenReservations, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'screenContentType' })
  ScreenContentType: ScreenContentType;

  @ManyToOne(() => Admin, (admin) => admin.ScreenReservations, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'adminId' })
  admin: Admin;
}

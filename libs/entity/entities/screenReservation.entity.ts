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

@Index('screenId', ['screenId'], {})
@Index('screenContentType', ['screenContentType'], {})
@Index('adminId', ['adminId'], {})
@Entity('screen_reservation')
export class ScreenReservation {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'screenId' })
  screenId: number;

  @Column('int', { name: 'screenContentType' })
  screenContentType: number;

  @Column('text', { name: 'contents' })
  contents: string;

  @Column('varchar', { name: 'description', length: 64, nullable: true })
  description: string;

  @Column({ nullable: true })
  adminId: number | null;

  @Column('datetime', { name: 'startedAt' })
  startedAt: Date;

  @Column('datetime', { name: 'endedAt' })
  endedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => ScreenInfo, (info) => info.ScreenReservations, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'screenId', referencedColumnName: 'id' }])
  ScreenInfo: ScreenInfo;

  @ManyToOne(() => ScreenContentType, (type) => type.ScreenReservations, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'screenContentType', referencedColumnName: 'type' }])
  ScreenContentType: ScreenContentType;

  @ManyToOne(() => Admin, (admin) => admin.ScreenReservations, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'adminId' }])
  admin: Admin;
}

import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { LicenseGroupInfo } from './licenseGroupInfo.entity';
import { EventSpaceType } from './eventSpaceType.entity';
import { CSAFEventBoothInfo } from './csafEventBoothInfo.entity';
import { CSAFEventEnterLog } from './csafEventEnterLog.entity';
import { Admin } from './admin.entity';
import { BaseModelEntity } from './baseModelEntity.entity';

@Index('adminId', ['adminId'], {})
@Index('eventSpaceType', ['eventSpaceType'], {})
@Entity('csaf_event_info')
export class CSAFEventInfo extends BaseModelEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column('varchar', { length: 32 })
  name: string;

  @Column('int')
  eventSpaceType: number;

  @Column({ nullable: true })
  adminId: number | null;

  @Column('datetime')
  startedAt: Date;

  @Column('datetime')
  endedAt: Date;

  @OneToOne(() => LicenseGroupInfo, (info) => info.CSAFEventInfo)
  LicenseGroupInfo: LicenseGroupInfo;

  @OneToMany(() => CSAFEventBoothInfo, (info) => info.CSAFEventInfo)
  CSAFEventBoothInfos: CSAFEventBoothInfo[];

  @OneToMany(() => CSAFEventEnterLog, (log) => log.CSAFEventInfo)
  CSAFEventEnterLogs: CSAFEventEnterLog[];

  @ManyToOne(() => Admin, (admin) => admin.CSAFEventInfos, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'adminId' })
  admin: Admin;

  @ManyToOne(() => EventSpaceType, (type) => type.CSAFEventInfos, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'eventSpaceType' })
  EventSpaceType: EventSpaceType;
}

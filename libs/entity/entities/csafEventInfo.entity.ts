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
import { User } from './user.entity';
import { LicenseGroupInfo } from './licenseGroupInfo.entity';
import { EventSpaceType } from './eventSpaceType.entity';
import { CSAFEventBoothInfo } from './csafEventBoothInfo.entity';
import { CSAFEventEnterLog } from './csafEventEnterLog.entity';

@Index('adminId', ['adminId'], {})
@Index('eventSpaceType', ['eventSpaceType'], {})
@Entity('csaf_event_info')
export class CSAFEventInfo {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', length: 32 })
  name: string;

  @Column('int', { name: 'eventSpaceType' })
  eventSpaceType: number;

  @Column('datetime', { name: 'startedAt' })
  startedAt: Date;

  @Column('datetime', { name: 'endedAt' })
  endedAt: Date;

  @Column('int', { name: 'adminId', nullable: true })
  adminId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => LicenseGroupInfo, (info) => info.CSAFEventInfo)
  LicenseGroupInfo: LicenseGroupInfo;

  @OneToMany(() => CSAFEventBoothInfo, (info) => info.CSAFEventInfo)
  CSAFEventBoothInfos: CSAFEventBoothInfo[];

  @OneToMany(() => CSAFEventEnterLog, (log) => log.CSAFEventInfo)
  CSAFEventEnterLogs: CSAFEventEnterLog[];

  @ManyToOne(() => User, (user) => user.CSAFEventInfos, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'adminId', referencedColumnName: 'id' }])
  Admin: User;

  @ManyToOne(() => EventSpaceType, (type) => type.CSAFEventInfos, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'eventSpaceType', referencedColumnName: 'type' }])
  EventSpaceType: EventSpaceType;
}

import { LicenseType } from './licenseType.entity';
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
import { OfficeLicenseDomainInfo } from './officeLicenseDomainInfo.entity';
import { LicenseInfo } from './licenseInfo.entity';
import { CSAFEventInfo } from './csafEventInfo.entity';
import { Admin } from './admin.entity';

@Index('domainId', ['domainId'], {})
@Index('adminId', ['adminId'], {})
@Index('licenseType', ['licenseType'], {})
@Entity('license_group_info')
export class LicenseGroupInfo {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column('int', { nullable: true })
  domainId: number;

  @Column('int', { nullable: true })
  eventId: number;

  @Column('varchar', { length: 64 })
  name: string;

  @Column('int')
  licenseType: number;

  @Column('int')
  issueCount: number;

  @Column('int', { default: 0 })
  useCount: number;

  @Column({ nullable: true })
  adminId: number | null;

  @Column('datetime')
  startedAt: Date;

  @Column('datetime')
  endedAt: Date;

  @Column('int', { nullable: true })
  expirationDay: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => OfficeLicenseDomainInfo, (info) => info.LicenseGroupInfo, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'domainId' })
  OfficeLicenseDomainInfo: OfficeLicenseDomainInfo;

  @OneToOne(() => CSAFEventInfo, (info) => info.LicenseGroupInfo, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'eventId' })
  CSAFEventInfo: CSAFEventInfo;

  @ManyToOne(() => Admin, (admin) => admin.LicenseGroupInfos, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'adminId' })
  admin: Admin;

  @ManyToOne(() => LicenseType, (type) => type.LicenseGroupInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'licenseType' })
  LicenseType: LicenseType;

  @OneToMany(() => LicenseInfo, (info) => info.LicenseGroupInfo)
  LicenseInfos: LicenseInfo[];
}

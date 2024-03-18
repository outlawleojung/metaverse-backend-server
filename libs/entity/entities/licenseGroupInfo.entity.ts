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
import { User } from './user.entity';
import { CSAFEventInfo } from './csafEventInfo.entity';

@Index('domainId', ['domainId'], {})
@Index('adminId', ['adminId'], {})
@Index('licenseType', ['licenseType'], {})
@Entity('license_group_info')
export class LicenseGroupInfo {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'domainId', nullable: true })
  domainId: number;

  @Column('int', { name: 'eventId', nullable: true })
  eventId: number;

  @Column('varchar', { name: 'name', length: 64 })
  name: string;

  @Column('int', { name: 'licenseType' })
  licenseType: number;

  @Column('int', { name: 'issueCount' })
  issueCount: number;

  @Column('int', { name: 'useCount', default: () => "'0'" })
  useCount: number;

  @Column('datetime', { name: 'startedAt' })
  startedAt: Date;

  @Column('datetime', { name: 'endedAt' })
  endedAt: Date;

  @Column('int', { name: 'expirationDay', nullable: true })
  expirationDay: number | null;

  @Column('int', { name: 'adminId', nullable: true })
  adminId: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => OfficeLicenseDomainInfo, (info) => info.LicenseGroupInfo, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'domainId', referencedColumnName: 'id' }])
  OfficeLicenseDomainInfo: OfficeLicenseDomainInfo;

  @OneToOne(() => CSAFEventInfo, (info) => info.LicenseGroupInfo, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'eventId', referencedColumnName: 'id' }])
  CSAFEventInfo: CSAFEventInfo;

  @ManyToOne(() => User, (user) => user.LicenseGroupInfos, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'adminId', referencedColumnName: 'id' }])
  Admin: User;

  @ManyToOne(() => LicenseType, (type) => type.LicenseGroupInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'licenseType', referencedColumnName: 'type' }])
  LicenseType: LicenseType;

  @OneToMany(() => LicenseInfo, (info) => info.LicenseGroupInfo)
  LicenseInfos: LicenseInfo[];
}

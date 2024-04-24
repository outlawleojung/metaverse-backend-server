import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { LicenseGroupInfo } from './licenseGroupInfo.entity';
import { Admin } from './admin.entity';
import { BaseModelEntity } from './baseModelEntity.entity';

@Index('adminId', ['adminId'], {})
@Entity('office_license_domain_info')
export class OfficeLicenseDomainInfo extends BaseModelEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column('varchar', { length: 32 })
  affiliation: string;

  @Column('varchar', { length: 32 })
  domainName: string;

  @Column('varchar', { length: 32, nullable: true })
  chargeName: string | null;

  @Column('varchar', { length: 32, nullable: true })
  chargePosition: string | null;

  @Column('varchar', { length: 32, nullable: true })
  chargeEmail: string | null;

  @Column('varchar', { length: 32, nullable: true })
  chargePhone: string | null;

  @Column()
  adminId: number;

  @OneToOne(() => LicenseGroupInfo, (info) => info.OfficeLicenseDomainInfo)
  LicenseGroupInfo: LicenseGroupInfo;

  @ManyToOne(() => Admin, (user) => user.OfficeLicenseDomainInfos, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'adminId' })
  admin: Admin;
}

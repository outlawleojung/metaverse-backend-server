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
import { User } from './user.entity';
import { LicenseGroupInfo } from './licenseGroupInfo.entity';

@Index('adminId', ['adminId'], {})
@Entity('office_license_domain_info')
export class OfficeLicenseDomainInfo {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'affiliation', length: 32 })
  affiliation: string;

  @Column('varchar', { name: 'domainName', length: 32 })
  domainName: string;

  @Column('varchar', { name: 'chargeName', length: 32, nullable: true })
  chargeName: string | null;

  @Column('varchar', { name: 'chargePosition', length: 32, nullable: true })
  chargePosition: string | null;

  @Column('varchar', { name: 'chargeEmail', length: 32, nullable: true })
  chargeEmail: string | null;

  @Column('varchar', { name: 'chargePhone', length: 32, nullable: true })
  chargePhone: string | null;

  @Column('int', { name: 'adminId', nullable: true })
  adminId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => LicenseGroupInfo, (info) => info.OfficeLicenseDomainInfo)
  LicenseGroupInfo: LicenseGroupInfo;

  @ManyToOne(() => User, (user) => user.OfficeLicenseDomainInfos, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'adminId', referencedColumnName: 'id' }])
  Admin: User;
}

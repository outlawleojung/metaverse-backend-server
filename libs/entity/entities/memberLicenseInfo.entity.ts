import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Member } from './member.entity';
import { LicenseInfo } from './licenseInfo.entity';

@Index('licenseSerial', ['licenseSerial'], {})
@Entity('member_license_info')
export class MemberLicenseInfo {
  @PrimaryColumn('uuid')
  memberId: string;

  @PrimaryColumn('varchar', { name: 'licenseSerial', length: 16 })
  licenseSerial: string;

  @Column('varchar', { name: 'email', length: 64 })
  email: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Member, (member) => member.MemberLicenseInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'memberId' }])
  Member: Member;

  @ManyToOne(() => LicenseInfo, (info) => info.MemberLicenseInfos, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([
    { name: 'licenseSerial', referencedColumnName: 'licenseSerial' },
  ])
  LicenseInfo: LicenseInfo;
}

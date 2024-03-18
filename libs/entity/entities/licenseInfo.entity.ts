import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MemberLicenseInfo } from './memberLicenseInfo.entity';
import { LicenseGroupInfo } from './licenseGroupInfo.entity';

@Index('groupId', ['groupId'], {})
@Entity('license_info')
export class LicenseInfo {
  @PrimaryColumn('varchar', { name: 'licenseSerial', length: 16 })
  licenseSerial: string;

  @Column('int', { name: 'groupId' })
  groupId: number;

  @Column('int', { name: 'isCompleted', default: () => "'0'" })
  isCompleted: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => MemberLicenseInfo, (info) => info.LicenseInfo)
  MemberLicenseInfos: MemberLicenseInfo[];

  @ManyToOne(() => LicenseGroupInfo, (info) => info.LicenseInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'groupId', referencedColumnName: 'id' }])
  LicenseGroupInfo: LicenseGroupInfo;
}

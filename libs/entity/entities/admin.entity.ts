import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { AdminLog } from './adminLog.entity';
import { Gateway } from './gateway.entity';
import { Terms } from './terms.entity';
import { RoleType } from './roleType.entity';
import { VoteInfo } from './voteInfo.entity';
import { VideoPlayInfo } from './videoPlayInfo.entity';
import { ApiProperty } from '@nestjs/swagger';
import { MemberInquiryAnswer } from './memberInquiryAnswer.entity';
import { InquiryTemplate } from './inquiryTemplate.entity';
import { OfficeLicenseDomainInfo } from './officeLicenseDomainInfo.entity';
import { LicenseGroupInfo } from './licenseGroupInfo.entity';
import { PostalLog } from './postalLog.entity';
import { Postbox } from './postbox.entity';
import { ScreenReservation } from './screenReservation.entity';
import { BannerReservation } from './bannerReservation.entity';
import { SelectVoteInfo } from './selectVoteInfo.entity';
import { AdminType } from './adminType.entity';
import { CSAFEventInfo } from './csafEventInfo.entity';
import { NoticeInfo } from './noticeInfo.entity';
import { BaseModelEntity } from './baseModelEntity.entity';
import { MemberReportInfo } from './memberReportInfo.entity';

@Index('email', ['email'], { unique: true })
@Index('roleType', ['roleType'], {})
@Entity('admin')
export class Admin extends BaseModelEntity {
  @Column('varchar', { name: 'email', unique: true, length: 64 })
  email: string;

  @ApiProperty({
    example: '송중기',
    description: '관리자 이름',
  })
  @Column('varchar', { name: 'name', length: 30 })
  name: string;

  @Column('varchar', { name: 'password', length: 100 })
  password: string;

  @Column('varchar', { name: 'department', nullable: true, length: 64 })
  department: string | null;

  @Column('varchar', {
    name: 'company',
    nullable: true,
    length: 64,
    default: () => "'한컴프론티스'",
  })
  company: string | null;

  @Column('varchar', { name: 'phoneNumber', length: 64 })
  phoneNumber: string;

  @Column()
  roleType: number;

  @Column()
  adminType: number;

  @Column('datetime', { name: 'loginedAt' })
  loginedAt: Date;

  @OneToMany(() => AdminLog, (adminlog) => adminlog.admin)
  AdminLogs: AdminLog[];

  @OneToMany(() => Gateway, (gateway) => gateway.admin)
  gateways: Gateway[];

  @OneToMany(() => Terms, (terms) => terms.admin)
  terms: Terms[];

  @ManyToOne(() => RoleType, (roletype) => roletype.Admins, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'roleType' }])
  RoleType: RoleType;

  @ManyToOne(() => AdminType, (type) => type.Admins, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'adminType' }])
  AdminType: AdminType;

  @OneToMany(() => VideoPlayInfo, (videoplayinfo) => videoplayinfo.admin)
  VideoPlayInfos: VideoPlayInfo[];

  @OneToMany(() => InquiryTemplate, (inquirytemplate) => inquirytemplate.admin)
  InquiryTemplates: InquiryTemplate[];

  @OneToMany(() => VoteInfo, (voteinfo) => voteinfo.admin)
  VoteInfos: VoteInfo[];

  @OneToMany(
    () => MemberInquiryAnswer,
    (memberinquiryanswer) => memberinquiryanswer.admin,
  )
  MemberInquiryAnswers: MemberInquiryAnswer[];

  @OneToMany(
    () => MemberReportInfo,
    (memberreportinfo) => memberreportinfo.admin,
  )
  MemberReportInfos: MemberReportInfo[];

  @OneToMany(() => OfficeLicenseDomainInfo, (info) => info.admin)
  OfficeLicenseDomainInfos: OfficeLicenseDomainInfo[];

  @OneToMany(() => LicenseGroupInfo, (info) => info.admin)
  LicenseGroupInfos: LicenseGroupInfo[];

  @OneToMany(() => PostalLog, (log) => log.admin)
  PostalLogs: PostalLog[];

  @OneToMany(() => Postbox, (postbox) => postbox.admin)
  Postboxes: Postbox[];

  @OneToMany(() => ScreenReservation, (param) => param.admin)
  ScreenReservations: ScreenReservation[];

  @OneToMany(() => BannerReservation, (param) => param.admin)
  BannerReservations: BannerReservation[];

  @OneToMany(() => SelectVoteInfo, (info) => info.admin)
  SelectVoteInfos: SelectVoteInfo[];

  @OneToMany(() => SelectVoteInfo, (info) => info.admin)
  CSAFEventInfos: CSAFEventInfo[];

  @OneToMany(() => NoticeInfo, (info) => info.admin)
  NoticeInfos: NoticeInfo[];
}

import { MemberPasswordAuth } from './memberPasswordAuth.entity';
import { MemberInquiryGroup } from './memberInquiryGroup.entity';
import { MyRoomStateType } from './myRoomStateType.entity';
import { MemberNicknameLog } from './memberNicknameLog.entity';
import { MemberBusinessCardInfo } from './memberBusinessCardInfo.entity';
import { OfficeGradeType } from './officeGradeType.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MemberBlock } from './memberBlock.entity';
import { MemberFriendRequest } from './memberFriendRequest.entity';
import { InfiniteCodeRank } from './infiniteCodeRank.entity';
import { MemberAccount } from './memberAccount.entity';
import { MemberAvatarInfo } from './memberAvatarInfo.entity';
import { MemberFriend } from './memberFriend.entity';
import { MemberInfiniteCodeRank } from './memberInfiniteCodeRank.entity';
import { MemberItemInven } from './memberItemInven.entity';
import { MemberLoginLog } from './memberLoginLog.entity';
import { MemberReportInfo } from './memberReportInfo.entity';
import { MemberVoteInfo } from './memberVoteInfo.entity';
import { SessionInfo } from './sessionInfo.entity';
import { MemberOfficeReservationInfo } from './memberOfficeReservationInfo.entity';
import { MemberOfficeReservationWaitingInfo } from './memberOfficeReservationWaitingInfo.entity';
import { ProviderType } from './providerType.entity';
import { MemberDefaultCardInfo } from './memberDefaultCardInfo.entity';
import { MemberAvatarPartsItemInven } from './memberAvatarPartsItemInven.entity';
import { MemberLicenseInfo } from './memberLicenseInfo.entity';
import { MemberIdentification } from './memberIdentification.entity';
import { RegPathType } from './regPathType.entity';
import { PostReceiveMemberInfo } from './postReceiveMemberInfo.entity';
import { MemberPostbox } from './memberPostbox.entity';
import { MemberConnectInfo } from './memberConnectInfo.entity';
import { MemberFurnitureItemInven } from './memberFurnitureItemInven.entity';
import { MemberPurchaseItem } from './memberPurchaseItem.entity';
import { MemberSelectVoteInfo } from './memberSelectVoteInfo.entity';
import { KtmfEventEmailInfo } from './ktmfEventEmailInfo.entiry';
import { MemberSelectVoteLike } from './memberSelectVoteLike.entity';
import { MemberMoney } from './memberMoney.entity';
import { MemberAdContents } from './memberAdContents.entity';
import { MemberWalletInfo } from './memberWalletInfo.entity';
import { MemberLoginRewardLog } from './memberLoginRewardLog.entity';
import { CSAFEventEnterLog } from './csafEventEnterLog.entity';
import { BaseModelEntity } from './baseModelEntity.entity';
import { MemberOfficeVisitLog } from './memberOfficeVisitLog.entity';
import { MemberRestriction } from './memberRestriction.entity';
import { MemberWalletLinkLog } from './memberWalletLinkLog.entity';

@Index('memberCode', ['memberCode'], { unique: true })
@Index('email', ['email'], {})
@Index('nickname', ['nickname'], {})
@Index('officeGradeType', ['officeGradeType'], {})
@Index('firstProviderType', ['firstProviderType'], {})
@Index('providerType', ['providerType'], {})
@Index('myRoomStateType', ['myRoomStateType'], {})
@Entity('member')
export class Member extends BaseModelEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { unique: true, length: 16 })
  memberCode: string;

  @Column('varchar', { nullable: true, length: 64 })
  email: string | null;

  @Column('varchar', { nullable: true, length: 64 })
  nickname: string | null;

  @Column('varchar', { nullable: true, length: 128 })
  stateMessage: string | null;

  @Column('int', { default: 1 })
  myRoomStateType: number;

  @Column('int', { default: 0 })
  seqLoginCnt: number;

  @Column('int', { default: 0 })
  totalLoginCnt: number;

  @Column('int', { default: 1 })
  officeGradeType: number;

  @Column('int', { default: 1 })
  providerType: number;

  @Column('int', { default: 1 })
  firstProviderType: number;

  @Column('text', { nullable: true })
  refreshToken: string;

  @Column('int')
  regPathType: number;

  @Column('datetime')
  loginedAt: Date;

  @Column('datetime', { nullable: true })
  passwdUpdatedAt: Date | null;

  @Column('datetime', { nullable: true })
  emailUpdatedAt: Date | null;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToMany(() => MemberBlock, (blockmember) => blockmember.Member)
  Members: MemberBlock[];

  @OneToMany(() => MemberBlock, (blockmember) => blockmember.MemberBlock)
  MemberBlocks: MemberBlock[];

  @OneToMany(
    () => MemberFriendRequest,
    (friendrequest) => friendrequest.RequestMember,
  )
  RequestMembers: MemberFriendRequest[];

  @OneToMany(
    () => MemberFriendRequest,
    (friendrequest) => friendrequest.ReceivedMember,
  )
  ReceivedMembers: MemberFriendRequest[];

  @OneToOne(
    () => InfiniteCodeRank,
    (infinitecoderank) => infinitecoderank.Member,
  )
  InfiniteCodeRank: InfiniteCodeRank;

  @OneToMany(() => MemberAccount, (memberaccount) => memberaccount.Member)
  MemberAccounts: MemberAccount[];

  @OneToMany(
    () => MemberAvatarInfo,
    (memberavatarinfo) => memberavatarinfo.Member,
  )
  MemberAvatarInfos: MemberAvatarInfo[];

  @OneToMany(() => MemberFriend, (memberfriend) => memberfriend.Member)
  OwnerMembers: MemberFriend[];

  @OneToMany(() => MemberFriend, (memberfriend) => memberfriend.FriendMember)
  MemberFriends: MemberFriend[];

  @OneToMany(
    () => MemberNicknameLog,
    (membernicknamelog) => membernicknamelog.Member,
  )
  MemberNicknameLogs: MemberNicknameLog[];

  @OneToMany(
    () => MemberInfiniteCodeRank,
    (memberinfinitecoderank) => memberinfinitecoderank.Member,
  )
  MemberInfiniteCodeRanks: MemberInfiniteCodeRank[];

  @OneToMany(
    () => MemberAvatarPartsItemInven,
    (memberavatarpartsiteminven) => memberavatarpartsiteminven.Member,
  )
  MemberAvatarPartsItemInvens: MemberAvatarPartsItemInven[];

  @OneToMany(() => MemberItemInven, (memberiteminven) => memberiteminven.Member)
  MemberItemInvens: MemberItemInven[];

  @OneToMany(() => MemberLoginLog, (memberloginlog) => memberloginlog.Member)
  MemberLoginLogs: MemberLoginLog[];

  @OneToMany(
    () => MemberReportInfo,
    (memberreportinfo) => memberreportinfo.ReportMember,
  )
  MemberReportInfos: MemberReportInfo[];

  @OneToMany(
    () => MemberReportInfo,
    (memberreportinfo) => memberreportinfo.TargetMember,
  )
  MemberReportTargetInfos: MemberReportInfo[];

  @OneToMany(() => MemberVoteInfo, (membervoteinfo) => membervoteinfo.Member)
  MemberVoteInfos: MemberVoteInfo[];

  @OneToMany(
    () => MemberSelectVoteInfo,
    (membervoteinfo) => membervoteinfo.Member,
  )
  MemberSelectVoteInfos: MemberSelectVoteInfo[];

  @OneToMany(
    () => MemberOfficeReservationInfo,
    (memberOfficeReservationInfo) => memberOfficeReservationInfo.Member,
  )
  MemberOfficeReservationInfos: MemberOfficeReservationInfo[];

  @OneToMany(
    () => MemberOfficeReservationWaitingInfo,
    (memberOfficeReservationWaitingInfo) =>
      memberOfficeReservationWaitingInfo.Member,
  )
  MemberOfficeReservationWaitingInfos: MemberOfficeReservationWaitingInfo[];

  @OneToMany(
    () => MemberBusinessCardInfo,
    (memberBusinessCardInfo) => memberBusinessCardInfo.Member,
  )
  MemberBusinessCardInfos: MemberBusinessCardInfo[];

  @OneToMany(() => MemberInquiryGroup, (inquiry) => inquiry.Member)
  MemberInquiryGroups: MemberInquiryGroup[];

  @OneToMany(() => MemberLicenseInfo, (info) => info.Member)
  MemberLicenseInfos: MemberLicenseInfo[];

  @OneToMany(() => PostReceiveMemberInfo, (info) => info.Member)
  PostReceiveMemberInfos: PostReceiveMemberInfo[];

  @OneToMany(() => MemberPostbox, (box) => box.Member)
  MemberPostboxes: MemberPostbox[];

  @OneToMany(() => MemberConnectInfo, (info) => info.Member)
  MemberConnectInfos: MemberConnectInfo[];

  @OneToMany(() => MemberFurnitureItemInven, (inven) => inven.Member)
  MemberFurnitureItemInvens: MemberFurnitureItemInven[];

  @OneToMany(() => MemberPurchaseItem, (item) => item.Member)
  MemberPurchaseItems: MemberPurchaseItem[];

  @OneToMany(() => MemberSelectVoteLike, (like) => like.Member)
  MemberSelectVoteLikes: MemberSelectVoteLike[];

  @OneToMany(() => MemberMoney, (money) => money.Member)
  MemberMoney: MemberMoney[];

  @OneToMany(() => MemberAdContents, (money) => money.Member)
  MemberAdContents: MemberAdContents[];

  @OneToMany(() => CSAFEventEnterLog, (log) => log.Member)
  CSAFEventEnterLogs: CSAFEventEnterLog[];

  @OneToMany(() => MemberOfficeVisitLog, (log) => log.Member)
  MemberOfficeVisitLogs: MemberOfficeVisitLog[];

  @OneToMany(() => MemberRestriction, (log) => log.Member)
  MemberRestrictions: MemberRestriction[];

  @OneToMany(() => MemberWalletLinkLog, (log) => log.Member)
  MemberWalletLinkLogs: MemberWalletLinkLog[];

  @ManyToOne(() => OfficeGradeType, (type) => type.Members, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'officeGradeType' })
  OfficeGradeType: OfficeGradeType;

  @ManyToOne(() => ProviderType, (type) => type.Members, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'firstProviderType' })
  ProviderType: ProviderType;

  @ManyToOne(() => MyRoomStateType, (type) => type.Members, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'myRoomStateType' })
  MyRoomStateType: MyRoomStateType;

  @ManyToOne(() => RegPathType, (type) => type.Members, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'regPathType' })
  RegPathType: RegPathType;

  @OneToOne(() => SessionInfo, (sessioninfo) => sessioninfo.Member)
  SessionInfo: SessionInfo;

  @OneToOne(
    () => MemberDefaultCardInfo,
    (memberDefaultCardInfo) => memberDefaultCardInfo.Member,
  )
  MemberDefaultCardInfo: MemberDefaultCardInfo;

  @OneToOne(
    () => MemberIdentification,
    (memberIdentification) => memberIdentification.Member,
  )
  MemberIdentification: MemberIdentification;

  @OneToOne(
    () => MemberPasswordAuth,
    (memberPasswordAuth) => memberPasswordAuth.Member,
  )
  MemberPasswordAuth: MemberPasswordAuth;

  @OneToOne(() => KtmfEventEmailInfo, (info) => info.Member)
  KtmfEventEmailInfo: KtmfEventEmailInfo;

  @OneToOne(() => MemberWalletInfo, (info) => info.Member)
  MemberWalletInfo: MemberWalletInfo;

  @OneToOne(() => MemberLoginRewardLog, (info) => info.Member)
  MemberLoginRewardLog: MemberLoginRewardLog;
}

import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Member } from './member.entity';
import { OfficeModeType } from './officeModeType.entity';
import { OfficeAlarmType } from './officeAlarmType.entity';
import { ApiProperty } from '@nestjs/swagger';
import { CSAFEventBoothInfo } from './csafEventBoothInfo.entity';
import { BoothFileBoxInfo } from './boothFileBoxInfo.entity';
import { EachBoothScreenInfo } from './eachBoothScreenInfo.entity';
import { EachBoothBannerInfo } from './eachBoothBannerInfo.entity';
import { RoomShortLink } from './roomShortLink.entity';
import { MemberOfficeReservationWaitingInfo } from './memberOfficeReservationWaitingInfo.entity';
import { OfficeTopicType } from './officeTopicType.entity';

@Index('roomCode', ['roomCode'], { unique: true })
@Index('memberId', ['memberId'], {})
@Index('modeType', ['modeType'], {})
@Index('topicType', ['topicType'], {})
@Index('alarmType', ['alarmType'], {})
@Entity('member_office_reservation_info')
export class MemberOfficeReservationInfo {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @ApiProperty({
    example: '593923859',
    description: '룸코드',
  })
  @Column('varchar', { name: 'roomCode', length: 20 })
  roomCode: string;

  @Column('varchar', { name: 'memberId', length: 100 })
  memberId: string;

  @ApiProperty({
    example: '아즈메타 회의실',
    description: '룸 이름',
  })
  @Column('varchar', { name: 'name', length: 64 })
  name: string;

  @ApiProperty({
    example: 1,
    description: '모드 타입',
  })
  @Column('int', { name: 'modeType' })
  modeType: number;

  @ApiProperty({
    example: 2,
    description: '토픽 타입',
  })
  @Column('int', { name: 'topicType' })
  topicType: number;

  @ApiProperty({
    example: '아즈메타 회의실 입니다.',
    description: '룸 설명',
  })
  @Column('varchar', { name: 'description', length: 256 })
  description: string;

  @ApiProperty({
    example: '12345',
    description: '패스워드',
  })
  @Column('varchar', { name: 'password', length: 128 })
  password: string;

  @ApiProperty({
    example: 25,
    description: '진행 시간',
  })
  @Column('int', { name: 'runningTime' })
  runningTime: number;

  @ApiProperty({
    example: 1001,
    description: '공간 설정 정보 아이디',
  })
  @Column('int', { name: 'spaceInfoId' })
  spaceInfoId: number;

  @ApiProperty({
    example: 4,
    description: '인원',
  })
  @Column('int', { name: 'personnel' })
  personnel: number;

  @ApiProperty({
    example: 3,
    description: '알람 타입',
  })
  @Column('int', { name: 'alarmType' })
  alarmType: number;

  @ApiProperty({
    example: 1,
    description: '홍보 노출 여부',
  })
  @Column('int', { name: 'isAdvertising', default: () => "'0'" })
  isAdvertising: number;

  @ApiProperty({
    example: 0,
    description: '대기실 여부',
  })
  @Column('int', { name: 'isWaitingRoom', default: () => "'0'" })
  isWaitingRoom: number;

  @ApiProperty({
    example: 0,
    description: '관전 가능 인원',
  })
  @Column('int', { name: 'observer', default: () => "'0'" })
  observer: number;

  @ApiProperty({
    example: 'image.png',
    description: '썸네일 파일 이름',
  })
  @Column('varchar', { name: 'thumbnail', length: 64, nullable: true })
  thumbnail: string;

  @ApiProperty({
    example: '2023-02-28',
    description: '예약 날짜',
  })
  @Column('date', { name: 'reservationAt', nullable: true })
  reservationAt: Date | null;

  @ApiProperty({
    example: 34,
    description: '반복 요일',
  })
  @Column('int', { name: 'repeatDay', nullable: true })
  repeatDay: number;

  @Column('int', { name: 'isHide', default: () => "'0'" })
  isHide: number;

  @ApiProperty({
    example: '12:00:00',
    description: '시작 시간',
  })
  @Column('int', { name: 'startTime' })
  startTime: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Member, (member) => member.MemberOfficeReservationInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'memberId', referencedColumnName: 'memberId' }])
  Member: Member;

  @ManyToOne(() => OfficeModeType, (modeType) => modeType.MemberOfficeReservationInfos, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'modeType', referencedColumnName: 'type' }])
  OfficeModeType: OfficeModeType;

  @ManyToOne(() => OfficeTopicType, (topicType) => topicType.MemberOfficeReservationInfos, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'topicType', referencedColumnName: 'type' }])
  OfficeTopicType: OfficeTopicType;

  @ManyToOne(() => OfficeAlarmType, (modeType) => modeType.MemberOfficeReservationInfos, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'alarmType', referencedColumnName: 'type' }])
  OfficeAlarmType: OfficeAlarmType;

  @OneToMany(() => MemberOfficeReservationWaitingInfo, (info) => info.MemberOfficeReservationInfo)
  MemberOfficeReservationWaitingInfos: MemberOfficeReservationWaitingInfo[];

  @OneToMany(() => CSAFEventBoothInfo, (info) => info.MemberOfficeReservationInfo)
  CSAFEventBoothInfos: CSAFEventBoothInfo[];

  @OneToMany(() => BoothFileBoxInfo, (info) => info.BoothInfo)
  BoothFileBoxInfos: BoothFileBoxInfo[];

  @OneToMany(() => EachBoothScreenInfo, (info) => info.BoothInfo)
  EachBoothScreenInfos: EachBoothScreenInfo[];

  @OneToMany(() => EachBoothBannerInfo, (info) => info.BoothInfo)
  EachBoothBannerInfos: EachBoothBannerInfo[];

  @OneToMany(() => RoomShortLink, (info) => info.RoomCodeInfo)
  RoomShortLinkInfos: RoomShortLink[];
}

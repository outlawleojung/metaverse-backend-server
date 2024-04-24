import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { InteractionType } from './interactionType.entity';
import { MemberOfficeReservationInfo } from './memberOfficeReservationInfo.entity';
import { UploadType } from './uploadType.entity';
import { BoothBannerInfo } from './boothBannerInfo.entity';

@Index('boothId', ['boothId'], {})
@Index('bannerId', ['bannerId'], {})
@Index('uploadType', ['uploadType'], {})
@Index('interactionType', ['interactionType'], {})
@Entity('each_booth_banner_info')
export class EachBoothBannerInfo {
  @PrimaryColumn('int')
  boothId: number;

  @PrimaryColumn('int')
  bannerId: number;

  @Column('int')
  uploadType: number;

  @Column('text')
  uploadValue: string;

  @Column('int')
  interactionType: number;

  @Column('text')
  interactionValue: string;

  @ManyToOne(
    () => MemberOfficeReservationInfo,
    (info) => info.EachBoothBannerInfos,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'boothId' })
  BoothInfo: MemberOfficeReservationInfo;

  @ManyToOne(() => BoothBannerInfo, (info) => info.EachBoothBannerInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'bannerId' })
  BoothBannerInfo: BoothBannerInfo;

  @ManyToOne(() => UploadType, (type) => type.EachBoothBannerInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'uploadType' })
  UploadType: UploadType;

  @ManyToOne(() => InteractionType, (type) => type.EachBoothBannerInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'interactionType' })
  InteractionType: InteractionType;
}

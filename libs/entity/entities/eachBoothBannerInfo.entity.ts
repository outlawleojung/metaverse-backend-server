import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
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
  @PrimaryColumn('int', { name: 'boothId' })
  boothId: number;

  @PrimaryColumn('int', { name: 'bannerId' })
  bannerId: number;

  @Column('int', { name: 'uploadType' })
  uploadType: number;

  @Column('text', { name: 'uploadValue' })
  uploadValue: string;

  @Column('int', { name: 'interactionType' })
  interactionType: number;

  @Column('text', { name: 'interactionValue' })
  interactionValue: string;

  @ManyToOne(() => MemberOfficeReservationInfo, (info) => info.EachBoothBannerInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'boothId', referencedColumnName: 'id' }])
  BoothInfo: MemberOfficeReservationInfo;

  @ManyToOne(() => BoothBannerInfo, (info) => info.EachBoothBannerInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'bannerId', referencedColumnName: 'id' }])
  BoothBannerInfo: BoothBannerInfo;

  @ManyToOne(() => UploadType, (type) => type.EachBoothBannerInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'uploadType', referencedColumnName: 'type' }])
  UploadType: UploadType;

  @ManyToOne(() => InteractionType, (type) => type.EachBoothBannerInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'interactionType', referencedColumnName: 'type' }])
  InteractionType: InteractionType;
}

import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { UploadType } from './uploadType.entity';
import { InteractionType } from './interactionType.entity';
import { MemberOfficeReservationInfo } from './memberOfficeReservationInfo.entity';
import { BoothScreenInfo } from './boothScreenInfo.entity';

@Index('boothId', ['boothId'], {})
@Index('screenId', ['screenId'], {})
@Index('uploadType', ['uploadType'], {})
@Index('interactionType', ['interactionType'], {})
@Entity('each_booth_screen_info')
export class EachBoothScreenInfo {
  @PrimaryColumn('int', { name: 'boothId' })
  boothId: number;

  @PrimaryColumn('int', { name: 'screenId' })
  screenId: number;

  @Column('int', { name: 'uploadType' })
  uploadType: number;

  @Column('text', { name: 'uploadValue' })
  uploadValue: string;

  @Column('int', { name: 'interactionType' })
  interactionType: number;

  @Column('text', { name: 'interactionValue' })
  interactionValue: string;

  @ManyToOne(() => MemberOfficeReservationInfo, (info) => info.EachBoothScreenInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'boothId', referencedColumnName: 'id' }])
  BoothInfo: MemberOfficeReservationInfo;

  @ManyToOne(() => BoothScreenInfo, (info) => info.EachBoothScreenInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'screenId', referencedColumnName: 'id' }])
  BoothScreenInfo: BoothScreenInfo;

  @ManyToOne(() => UploadType, (type) => type.EachBoothScreenInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'uploadType', referencedColumnName: 'type' }])
  UploadType: UploadType;

  @ManyToOne(() => InteractionType, (type) => type.EachBoothScreenInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'interactionType', referencedColumnName: 'type' }])
  InteractionType: InteractionType;
}

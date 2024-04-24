import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
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
  @PrimaryColumn('int')
  boothId: number;

  @PrimaryColumn('int')
  screenId: number;

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
    (info) => info.EachBoothScreenInfos,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'boothId' })
  BoothInfo: MemberOfficeReservationInfo;

  @ManyToOne(() => BoothScreenInfo, (info) => info.EachBoothScreenInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'screenId' })
  BoothScreenInfo: BoothScreenInfo;

  @ManyToOne(() => UploadType, (type) => type.EachBoothScreenInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'uploadType' })
  UploadType: UploadType;

  @ManyToOne(() => InteractionType, (type) => type.EachBoothScreenInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'interactionType' })
  InteractionType: InteractionType;
}

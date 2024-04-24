import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FileBoxType } from './fileBoxType.entity';
import { MemberOfficeReservationInfo } from './memberOfficeReservationInfo.entity';
import { BaseModelEntity } from './baseModelEntity.entity';

@Index('fileBoxType', ['fileBoxType'], {})
@Index('boothId', ['boothId'], {})
@Entity('booth_file_box_info')
export class BoothFileBoxInfo extends BaseModelEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column('int')
  boothId: number;

  @Column('int')
  fileBoxType: number;

  @Column('varchar', { length: 64 })
  fileName: string;

  @Column('varchar', { length: 128 })
  link: string;

  @ManyToOne(
    () => MemberOfficeReservationInfo,
    (info) => info.BoothFileBoxInfos,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'boothId' })
  BoothInfo: MemberOfficeReservationInfo;

  @ManyToOne(() => FileBoxType, (type) => type.BoothFileBoxInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'fileBoxType' })
  FileBoxType: FileBoxType;
}

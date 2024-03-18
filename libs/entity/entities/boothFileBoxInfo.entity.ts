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

@Index('fileBoxType', ['fileBoxType'], {})
@Index('boothId', ['boothId'], {})
@Entity('booth_file_box_info')
export class BoothFileBoxInfo {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'boothId' })
  boothId: number;

  @Column('int', { name: 'fileBoxType' })
  fileBoxType: number;

  @Column('varchar', { name: 'fileName', length: 64 })
  fileName: string;

  @Column('varchar', { name: 'link', length: 128 })
  link: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => MemberOfficeReservationInfo, (info) => info.BoothFileBoxInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'boothId', referencedColumnName: 'id' }])
  BoothInfo: MemberOfficeReservationInfo;

  @ManyToOne(() => FileBoxType, (type) => type.BoothFileBoxInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'fileBoxType', referencedColumnName: 'type' }])
  FileBoxType: FileBoxType;
}

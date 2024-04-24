import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { OfficeSpaceInfo } from './officeSpaceInfo.entity';

@Index('num', ['num'], {})
@Entity('office_seat_info')
export class OfficeSeatInfo {
  @PrimaryColumn('int')
  spaceId: number;

  @PrimaryColumn('int')
  num: number;

  @Column('varchar', { length: 64 })
  seatName: string;

  @ManyToOne(() => OfficeSpaceInfo, (info) => info.OfficeSeatInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'spaceId' })
  OfficeSpaceInfo: OfficeSpaceInfo;
}

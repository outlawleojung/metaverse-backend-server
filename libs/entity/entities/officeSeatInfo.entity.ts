import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { OfficeSpaceInfo } from './officeSpaceInfo.entity';

@Index('num', ['num'], {})
@Entity('office_seat_info')
export class OfficeSeatInfo {
  @PrimaryColumn('int', { name: 'spaceId' })
  spaceId: number;

  @PrimaryColumn('int', { name: 'num' })
  num: number;

  @Column('varchar', { name: 'seatName', length: 64 })
  seatName: string;

  @ManyToOne(() => OfficeSpaceInfo, (info) => info.OfficeSeatInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'spaceId', referencedColumnName: 'id' }])
  OfficeSpaceInfo: OfficeSpaceInfo;
}

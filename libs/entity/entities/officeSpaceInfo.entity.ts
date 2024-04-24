import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { OfficeModeType } from './officeModeType.entity';
import { Localization } from './localization.entity';
import { OfficeSeatInfo } from './officeSeatInfo.entity';

@Index('modeType', ['modeType'], {})
@Index('description', ['description'], {})
@Index('spacename', ['spaceName'], {})
@Entity('office_space_info')
export class OfficeSpaceInfo {
  @PrimaryColumn('int')
  id: number;

  @Column('int')
  modeType: number;

  @Column('int')
  exposureOrder: number;

  @Column('varchar', { length: 64 })
  description: string;

  @Column('varchar', { length: 64 })
  spaceName: string;

  @Column('varchar', { nullable: true, length: 64 })
  thumbnail: string | null;

  @Column('varchar', { nullable: true, length: 64 })
  sceneName: string | null;

  @Column('int')
  defaultCapacity: number;

  @Column('int')
  minCapacity: number;

  @Column('int')
  maxCapacity: number;

  @Column('int')
  maxObserver: number;

  @Column('int')
  sitCapacity: number;

  @OneToMany(() => OfficeSeatInfo, (info) => info.OfficeSpaceInfo)
  OfficeSeatInfos: OfficeSeatInfo[];

  @ManyToOne(() => OfficeModeType, (type) => type.OfficeSpaceInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'modeType' })
  OfficeModeType: OfficeModeType;

  @ManyToOne(
    () => Localization,
    (localization) => localization.OfficeSpaceInfoDescs,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'description' })
  LocalizationDesc: Localization;

  @ManyToOne(
    () => Localization,
    (localization) => localization.OfficeSpaceInfoNames,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'spaceName' })
  LocalizationName: Localization;
}

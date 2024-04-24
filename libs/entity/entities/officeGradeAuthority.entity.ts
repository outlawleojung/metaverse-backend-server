import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { OfficeGradeType } from './officeGradeType.entity';

@Entity('office_grade_authority')
export class OfficeGradeAuthority {
  @PrimaryColumn('int')
  gradeType: number;

  @Column('int')
  isUsePaidRoom: number;

  @Column('int')
  capacityLimit: number;

  @Column('int')
  reserveLimit: number;

  @Column('int')
  isThumbnail: number;

  @Column('int')
  isWaitingRoom: number;

  @Column('int')
  isAdvertising: number;

  @Column('int')
  isObserver: number;

  @Column('int')
  isChangeAdmin: number;

  @Column('int')
  timeLimit: number;

  @Column('int')
  isChangeTime: number;

  @ManyToOne(
    () => OfficeGradeType,
    (officeGradeType) => officeGradeType.OfficeGradeAuthorities,
    {
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'gradeType' })
  OfficeGradeType: OfficeGradeType;
}

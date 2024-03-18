import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { OfficeGradeType } from './officeGradeType.entity';

@Entity('office_grade_authority')
export class OfficeGradeAuthority {
  @PrimaryColumn('int', { name: 'gradeType' })
  gradeType: number;

  @Column('int', { name: 'isUsePaidRoom' })
  isUsePaidRoom: number;

  @Column('int', { name: 'capacityLimit' })
  capacityLimit: number;

  @Column('int', { name: 'reserveLimit' })
  reserveLimit: number;

  @Column('int', { name: 'isThumbnail' })
  isThumbnail: number;

  @Column('int', { name: 'isWaitingRoom' })
  isWaitingRoom: number;

  @Column('int', { name: 'isAdvertising' })
  isAdvertising: number;

  @Column('int', { name: 'isObserver' })
  isObserver: number;

  @Column('int', { name: 'isChangeAdmin' })
  isChangeAdmin: number;

  @Column('int', { name: 'timeLimit' })
  timeLimit: number;

  @Column('int', { name: 'isChangeTime' })
  isChangeTime: number;

  @ManyToOne(() => OfficeGradeType, (officeGradeType) => officeGradeType.OfficeGradeAuthorities, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'gradeType', referencedColumnName: 'type' }])
  OfficeGradeType: OfficeGradeType;
}

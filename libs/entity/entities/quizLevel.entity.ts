import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('quiz_level')
export class QuizLevel {
  @PrimaryColumn('int')
  level: number;

  @Column('int')
  waitTime: number;

  @Column('int')
  playTime: number;
}

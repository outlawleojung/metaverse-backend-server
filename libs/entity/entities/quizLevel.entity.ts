import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('quiz_level')
export class QuizLevel {
  @PrimaryColumn('int', { name: 'level' })
  level: number;

  @Column('int', { name: 'waitTime' })
  waitTime: number;

  @Column('int', { name: 'playTime' })
  playTime: number;
}

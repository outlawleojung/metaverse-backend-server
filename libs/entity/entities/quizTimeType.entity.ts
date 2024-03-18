import { Entity, OneToMany } from 'typeorm';
import { QuizRoundTime } from './quizRoundTime.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('quiz_time_type')
export class QuizTimeType extends BaseTypeEntity {
  @OneToMany(() => QuizRoundTime, (quizroundtime) => quizroundtime.QuizTimeType)
  QuizRoundTimes: QuizRoundTime[];
}

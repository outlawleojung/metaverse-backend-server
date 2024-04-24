import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { QuizTimeType } from './quizTimeType.entity';

@Index('timeType', ['timeType'], {})
@Entity('quiz_round_time')
export class QuizRoundTime {
  @PrimaryColumn('int')
  round: number;

  @Column('int')
  timeType: number;

  @ManyToOne(
    () => QuizTimeType,
    (quiztimetype) => quiztimetype.QuizRoundTimes,
    {
      onDelete: 'NO ACTION',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'timeType' })
  QuizTimeType: QuizTimeType;
}

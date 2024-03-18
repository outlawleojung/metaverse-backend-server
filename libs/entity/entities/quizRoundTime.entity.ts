import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { QuizTimeType } from './quizTimeType.entity';

@Index('timeType', ['timeType'], {})
@Entity('quiz_round_time')
export class QuizRoundTime {
  @PrimaryColumn('int', { name: 'round' })
  round: number;

  @Column('int', { name: 'timeType' })
  timeType: number;

  @ManyToOne(() => QuizTimeType, (quiztimetype) => quiztimetype.QuizRoundTimes, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'timeType', referencedColumnName: 'type' }])
  QuizTimeType: QuizTimeType;
}

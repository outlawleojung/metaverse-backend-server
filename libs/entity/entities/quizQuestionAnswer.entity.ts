import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { QuizAnswerType } from './quizAnswerType.entity';
import { Localization } from './localization.entity';

@Index('answerType', ['answerType'], {})
@Index('questionId', ['questionId'], {})
@Entity('quiz_question_answer')
export class QuizQuestionAnswer {
  @PrimaryColumn('int', { name: 'id' })
  id: number;

  @Column('varchar', { name: 'questionId', length: 64 })
  questionId: string;

  @Column('int', { name: 'answerType' })
  answerType: number;

  @ManyToOne(() => QuizAnswerType, (quizanswertype) => quizanswertype.QuizQuestionAnswers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'answerType', referencedColumnName: 'type' }])
  QuizAnswerType: QuizAnswerType;

  @ManyToOne(() => Localization, (localization) => localization.QuizQuestionAnswer, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'questionId', referencedColumnName: 'id' }])
  LocalizationQuestion: Localization;
}

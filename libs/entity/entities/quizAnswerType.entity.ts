import { Entity, OneToMany } from 'typeorm';
import { QuizQuestionAnswer } from './quizQuestionAnswer.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('quiz_answer_type')
export class QuizAnswerType extends BaseTypeEntity {
  @OneToMany(
    () => QuizQuestionAnswer,
    (quizquestionanswer) => quizquestionanswer.QuizAnswerType,
  )
  QuizQuestionAnswers: QuizQuestionAnswer[];
}

import { Column, Entity, OneToMany } from 'typeorm';
import { QuizQuestionAnswer } from './quizQuestionAnswer.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('quizanswer_type')
export class QuizAnswerType extends BaseTypeEntity {
  @OneToMany(() => QuizQuestionAnswer, (quizquestionanswer) => quizquestionanswer.QuizAnswerType)
  QuizQuestionAnswers: QuizQuestionAnswer[];
}

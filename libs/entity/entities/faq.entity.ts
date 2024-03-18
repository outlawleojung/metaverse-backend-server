import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('faq')
export class Faq {
  @PrimaryColumn('int', { name: 'id' })
  id: number;

  @Column('text', { name: 'question' })
  question: string;

  @Column('text', { name: 'answer' })
  answer: string;
}

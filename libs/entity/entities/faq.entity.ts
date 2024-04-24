import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('faq')
export class Faq {
  @PrimaryColumn('int')
  id: number;

  @Column('text')
  question: string;

  @Column('text')
  answer: string;
}

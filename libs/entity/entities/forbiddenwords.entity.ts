import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('forbidden_words')
export class Forbiddenwords {
  @PrimaryColumn('int')
  id: number;

  @Column('text')
  text: string;
}

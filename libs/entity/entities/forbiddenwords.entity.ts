import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('forbidden_words')
export class Forbiddenwords {
  @PrimaryColumn('int', { name: 'id' })
  id: number;

  @Column('text', { name: 'text' })
  text: string;
}

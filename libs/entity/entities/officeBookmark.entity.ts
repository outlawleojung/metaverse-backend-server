import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('office_bookmark')
export class OfficeBookmark {
  @PrimaryColumn('int')
  id: number;

  @Column('varchar', { length: 64 })
  name: string;

  @Column('varchar', { length: 128 })
  thumbnail: string;

  @Column('varchar', { length: 256 })
  url: string;
}

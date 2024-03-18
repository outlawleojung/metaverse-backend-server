import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('office_bookmark')
export class OfficeBookmark {
  @PrimaryColumn('int', { name: 'id' })
  id: number;

  @Column('varchar', { name: 'name', length: 64 })
  name: string;

  @Column('varchar', { name: 'thumbnail', length: 128 })
  thumbnail: string;

  @Column('varchar', { name: 'url', length: 256 })
  url: string;
}

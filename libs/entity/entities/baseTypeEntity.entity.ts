import { Column, PrimaryColumn } from 'typeorm';

export class BaseTypeEntity {
  @PrimaryColumn('int', { name: 'type' })
  type: number;

  @Column('varchar', { name: 'name', length: 64 })
  name: string;
}

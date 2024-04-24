import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('function_table')
export class FunctionTable {
  @PrimaryColumn('int')
  id: number;

  @Column('varchar', { length: 64 })
  description: string;

  @Column('int')
  value: number;
}

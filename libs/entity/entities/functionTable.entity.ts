import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('function_table')
export class FunctionTable {
  @PrimaryColumn('int', { name: 'id' })
  id: number;

  @Column('varchar', { name: 'description', length: 64 })
  description: string;

  @Column('int', { name: 'value' })
  value: number;
}

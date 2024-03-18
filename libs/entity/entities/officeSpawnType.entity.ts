import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { OfficeDefaultOption } from './officeDefaultOption.entity';

@Entity('office_spawn_type')
export class OfficeSpawnType {
  @PrimaryColumn('int', { name: 'type' })
  type: number;

  @Column('varchar', { name: 'name', length: 20 })
  name: string;

  @OneToMany(() => OfficeDefaultOption, (officedefaultoption) => officedefaultoption.OfficeSpawnType)
  OfficeDefaultOptions: OfficeDefaultOption[];
}

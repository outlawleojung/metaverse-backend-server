import { Column, Entity, PrimaryColumn } from 'typeorm';
import { BaseModelEntity } from './baseModelEntity.entity';

@Entity('reset_passwd_count')
export class ResetPasswdCount extends BaseModelEntity {
  @PrimaryColumn('varchar', { length: 256 })
  id: string;

  @Column('int')
  count: number;
}

import { Column, Entity, Index, OneToMany } from 'typeorm';
import { Gateway } from './gateway.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Index('type', ['type'], { unique: true })
@Entity('os_type')
export class OsType extends BaseTypeEntity {
  @Column('varchar', { name: 'storeUrl', length: 100 })
  storeUrl: string;

  @OneToMany(() => Gateway, (gateway) => gateway.OsType)
  gateways: Gateway[];
}

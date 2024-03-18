import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('postal_type_property')
export class PostalTypeProperty {
  @PrimaryColumn('int', { name: 'postalType' })
  postalType: number;

  @Column('int', { name: 'period' })
  period: number;
}

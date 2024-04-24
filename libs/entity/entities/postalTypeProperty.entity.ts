import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('postal_type_property')
export class PostalTypeProperty {
  @PrimaryColumn('int')
  postalType: number;

  @Column('int')
  period: number;
}

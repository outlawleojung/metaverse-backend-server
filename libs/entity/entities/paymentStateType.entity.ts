import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('payment_state_type')
export class PaymentStateType {
  @PrimaryColumn('int', { name: 'type' })
  type: number;

  @Column('varchar', { name: 'name', length: 20 })
  name: string;
}

import { Entity } from 'typeorm';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('payment_state_type')
export class PaymentStateType extends BaseTypeEntity {}

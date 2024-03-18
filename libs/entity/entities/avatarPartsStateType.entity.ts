import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { MannequinPurchaseState } from './mannequinPurchaseState.entity';

@Entity('avatar_parts_state_type')
export class AvatarPartsStateType {
  @PrimaryColumn('int', { name: 'type' })
  type: number;

  @Column('varchar', { name: 'name', length: 64 })
  name: string;

  @OneToMany(
    () => MannequinPurchaseState,
    (mannequinpurchasestate) => mannequinpurchasestate.AvatarPartsStateType,
  )
  MannequinPurchaseStates: MannequinPurchaseState[];
}

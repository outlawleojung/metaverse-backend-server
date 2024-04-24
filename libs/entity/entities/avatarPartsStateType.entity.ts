import { Entity, OneToMany } from 'typeorm';
import { MannequinPurchaseState } from './mannequinPurchaseState.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('avatar_parts_state_type')
export class AvatarPartsStateType extends BaseTypeEntity {
  @OneToMany(
    () => MannequinPurchaseState,
    (mannequinpurchasestate) => mannequinpurchasestate.AvatarPartsStateType,
  )
  MannequinPurchaseStates: MannequinPurchaseState[];
}

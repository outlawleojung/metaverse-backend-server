import { Entity, OneToMany, OneToOne } from 'typeorm';
import { CommerceZoneMannequin } from './commerceZoneMannequin.entity';
import { MannequinPurchaseState } from './mannequinPurchaseState.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('mannequin_model_type')
export class MannequinModelType extends BaseTypeEntity {
  @OneToMany(() => CommerceZoneMannequin, (commercezonemannequin) => commercezonemannequin.MannequinModelType)
  CommerceZoneMannequins: CommerceZoneMannequin[];

  @OneToOne(() => MannequinPurchaseState, (mannequinpurchasestate) => mannequinpurchasestate.MannequinModelType)
  MannequinPurchaseState: MannequinPurchaseState;
}

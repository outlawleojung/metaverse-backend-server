import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { MannequinModelType } from './mannequinModelType.entity';
import { AvatarPartsStateType } from './avatarPartsStateType.entity';

@Index('stateType', ['stateType'], {})
@Entity('mannequin_purchase_state')
export class MannequinPurchaseState {
  @PrimaryColumn('int')
  modelType: number;

  @Column('int')
  stateType: number;

  @OneToOne(
    () => MannequinModelType,
    (mannequinmodeltype) => mannequinmodeltype.MannequinPurchaseState,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'modelType' })
  MannequinModelType: MannequinModelType;

  @ManyToOne(
    () => AvatarPartsStateType,
    (avatarpartsstatetype) => avatarpartsstatetype.MannequinPurchaseStates,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'stateType' })
  AvatarPartsStateType: AvatarPartsStateType;
}

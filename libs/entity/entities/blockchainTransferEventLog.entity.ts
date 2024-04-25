import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseModelEntity } from './baseModelEntity.entity';

@Entity('blockchain_transfer_event_log')
export class BlockchainTransferEventLog extends BaseModelEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column('varchar', { length: 100 })
  from: string;

  @Column('varchar', { length: 100 })
  to: string;

  @Column('varchar', { length: 100 })
  tokenId: string;

  @Column('text')
  event: string;
}

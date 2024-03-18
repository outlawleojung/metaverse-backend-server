import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('blopckchain_transfer_eventLog')
export class BlockchainTransferEventLog {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'from', length: 100 })
  from: string;

  @Column('varchar', { name: 'to', length: 100 })
  to: string;

  @Column('varchar', { name: 'tokenId', length: 100 })
  tokenId: string;

  @Column('text', { name: 'event' })
  event: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

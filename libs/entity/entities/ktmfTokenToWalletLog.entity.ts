import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('ktmf_nft_token_to_wallet_log')
export class KtmfNftTokenToWalletLog {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'tokenId', length: 64 })
  tokenId: string;

  @Column('varchar', { name: 'walletAddr', length: 128 })
  walletAddr: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Index('tokenId', ['tokenId'], {})
@Index('walletAddr', ['walletAddr'], {})
@Entity('ktmf_nft_token_to_wallet')
export class KtmfNftTokenToWallet {
  @PrimaryColumn('varchar', { name: 'tokenId', length: 64 })
  tokenId: string;

  @Column('varchar', { name: 'walletAddr', length: 128 })
  walletAddr: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

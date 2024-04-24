import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseModelEntity } from './baseModelEntity.entity';

@Entity('ktmf_nft_token_to_wallet_log')
export class KtmfNftTokenToWalletLog extends BaseModelEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column('varchar', { length: 64 })
  tokenId: string;

  @Column('varchar', { length: 128 })
  walletAddr: string;
}

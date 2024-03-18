import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('reset_passwd_count')
export class ResetPasswdCount {
  @PrimaryColumn('varchar', { name: 'id', length: 256 })
  id: string;

  @Column('int', { name: 'count' })
  count: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

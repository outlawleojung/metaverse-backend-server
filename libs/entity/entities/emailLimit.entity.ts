import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('email_limit')
export class EmailLimit {
  @PrimaryColumn('varchar', { name: 'email', length: 64 })
  email: string;

  @Column('int', { name: 'count' })
  count: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

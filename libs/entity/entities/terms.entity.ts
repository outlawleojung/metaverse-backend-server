import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Index('adminId', ['adminId'], {})
@Entity('terms')
export class Terms {
  @PrimaryColumn('int', { name: 'id' })
  id: number;

  @Column('text', { name: 'service' })
  service: string;

  @Column('text', { name: 'policy' })
  policy: string;

  @Column('text', { name: 'privacy' })
  privacy: string;

  @Column('int', { name: 'adminId', nullable: true })
  adminId: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.terms, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'adminId', referencedColumnName: 'id' }])
  admin: User;
}

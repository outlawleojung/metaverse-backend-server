import { Column, Entity, Index, ManyToOne, PrimaryColumn } from 'typeorm';
import { Admin } from './admin.entity';
import { BaseModelEntity } from './baseModelEntity.entity';

@Index('adminId', ['adminId'], {})
@Entity('terms')
export class Terms extends BaseModelEntity {
  @PrimaryColumn('int')
  id: number;

  @Column('text')
  service: string;

  @Column('text')
  policy: string;

  @Column('text')
  privacy: string;

  @Column('int', { nullable: true })
  adminId: number | null;

  @ManyToOne(() => Admin, (admin) => admin.terms, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  admin: Admin;
}

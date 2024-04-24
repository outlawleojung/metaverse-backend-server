import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { InquiryType } from './inquiryType.entity';
import { Admin } from './admin.entity';
import { BaseModelEntity } from './baseModelEntity.entity';

@Index('inquiryType', ['inquiryType'], {})
@Index('adminId', ['adminId'], {})
@Entity('inquiry_template')
export class InquiryTemplate extends BaseModelEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column('int')
  inquiryType: number;

  @Column('varchar', { length: 64 })
  name: string;

  @Column('varchar', { length: 64 })
  description: string;

  @Column('varchar', { length: 512 })
  content: string;

  @Column()
  adminId: number;

  @ManyToOne(() => InquiryType, (inquirytype) => inquirytype.InquiryTemplates, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'inquiryType' })
  InquiryType: InquiryType;

  @ManyToOne(() => Admin, (admin) => admin.InquiryTemplates, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'adminId' })
  admin: Admin;
}

import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { InquiryType } from './inquiryType.entity';
import { User } from './user.entity';

@Index('inquiryType', ['inquiryType'], {})
@Index('adminId', ['adminId'], {})
@Entity('inquiry_template')
export class InquiryTemplate {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'inquiryType' })
  inquiryType: number;

  @Column('int', { name: 'adminId' })
  adminId: number;

  @Column('varchar', { name: 'name', length: 64 })
  name: string;

  @Column('varchar', { name: 'description', length: 64 })
  description: string;

  @Column('varchar', { name: 'content', length: 512 })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => InquiryType, (inquirytype) => inquirytype.InquiryTemplates, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'inquiryType', referencedColumnName: 'type' }])
  InquiryType: InquiryType;

  @ManyToOne(() => User, (user) => user.InquiryTemplates, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'adminId', referencedColumnName: 'id' }])
  Admin: User;
}

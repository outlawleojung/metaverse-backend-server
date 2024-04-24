import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Member } from './member.entity';

@Index('CI', ['CI'], { unique: true })
@Entity('member_identification')
export class MemberIdentification {
  @PrimaryColumn('uuid')
  memberId: string;

  @Column('varchar', { length: 32 })
  name: string;

  @Column('date')
  birthdate: Date;

  @Column('int')
  gender: number;

  @Column('varchar', { length: 128 })
  CI: string;

  @Column('varchar', { length: 32 })
  phoneNumber: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Member, (member) => member.MemberIdentification, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'memberId' })
  Member: Member;
}

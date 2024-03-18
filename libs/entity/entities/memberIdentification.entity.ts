import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Member } from './member.entity';

@Index('CI', ['CI'], { unique: true })
@Entity('member_identification')
export class MemberIdentification {
  @PrimaryColumn('varchar', { name: 'memberId', length: 100 })
  memberId: string;

  @Column('varchar', { name: 'name', length: 32 })
  name: string;

  @Column('date', { name: 'birthdate' })
  birthdate: Date;

  @Column('int', { name: 'gender' })
  gender: number;

  @Column('varchar', { name: 'CI', length: 100 })
  CI: string;

  @Column('varchar', { name: 'phoneNumber', length: 32 })
  phoneNumber: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Member, (member) => member.MemberIdentification, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'memberId', referencedColumnName: 'memberId' }])
  Member: Member;
}

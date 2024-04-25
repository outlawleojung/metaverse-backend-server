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
import { Member } from './member.entity';
import { DisciplineType } from './disciplineType.entity';

@Index('disciplineType', ['disciplineType'], {})
@Entity('member_restriction')
export class MemberRestriction {
  @PrimaryColumn('uuid')
  memberId: string;

  @Column('int')
  disciplineType: number;

  @Column('int')
  days: number;

  @Column('datetime')
  startedAt: Date;

  @Column('datetime')
  endedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Member, (member) => member.MemberRestrictions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'memberId' })
  Member: Member;

  @ManyToOne(() => DisciplineType, (type) => type.MemberRestrictions, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'disciplineType' })
  DisciplineType: DisciplineType;
}

import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { Member } from './member.entity';

@Entity('infinite_code_rank')
export class InfiniteCodeRank {
  @PrimaryColumn('varchar', { name: 'memberId', length: 100 })
  memberId: string;

  @Column('float', { name: 'userScore', nullable: true, precision: 12 })
  userScore: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Member, (member) => member.InfiniteCodeRank, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'memberId', referencedColumnName: 'memberId' }])
  Member: Member;
}

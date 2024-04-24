import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('resign_member')
export class ResignMember {
  @PrimaryColumn('uuid')
  memberId: string;

  @Column('int')
  providerType: number;

  @Column('int', { default: 1 })
  memberType: number;

  @Column('varchar', { length: 30 })
  email: string;

  @Column('varchar', { length: 30 })
  normalizeEmail: string;

  @Column('varchar', { nullable: true, length: 100 })
  password: string | null;

  @Column('varchar', { nullable: true, length: 30 })
  name: string | null;

  @Column('varchar', { nullable: true, length: 30 })
  normalizeName: string | null;

  @Column('varchar', { nullable: true, length: 30 })
  nickname: string | null;

  @Column('varchar', { nullable: true, length: 30 })
  normalizeNickname: string | null;

  @Column('int', { default: 0 })
  seqLoginCnt: number;

  @Column('int', { default: 0 })
  totalLoginCnt: number;

  @Column('datetime')
  loginedAt: Date;

  @Column('datetime')
  resignedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('resign_member')
export class ResignMember {
  @PrimaryColumn('varchar', { name: 'memberId', length: 100 })
  memberId: string;

  @Column('int', { name: 'providerType' })
  providerType: number;

  @Column('int', { name: 'memberType', default: () => "'1'" })
  memberType: number;

  @Column('varchar', { name: 'email', length: 30 })
  email: string;

  @Column('varchar', { name: 'normalizeEmail', length: 30 })
  normalizeEmail: string;

  @Column('varchar', { name: 'password', nullable: true, length: 100 })
  password: string | null;

  @Column('varchar', { name: 'name', nullable: true, length: 30 })
  name: string | null;

  @Column('varchar', { name: 'normalizeName', nullable: true, length: 30 })
  normalizeName: string | null;

  @Column('varchar', { name: 'nickname', nullable: true, length: 30 })
  nickname: string | null;

  @Column('varchar', { name: 'normalizeNickname', nullable: true, length: 30 })
  normalizeNickname: string | null;

  @Column('int', { name: 'seqLoginCnt', default: () => "'0'" })
  seqLoginCnt: number;

  @Column('int', { name: 'totalLoginCnt', default: () => "'0'" })
  totalLoginCnt: number;

  @Column('datetime', { name: 'loginedAt' })
  loginedAt: Date;

  @Column('datetime', { name: 'resignedAt' })
  resignedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

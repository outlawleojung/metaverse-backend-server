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

@Index('roomId', ['roomId'], {})
@Entity('member_connect_info')
export class MemberConnectInfo {
  @PrimaryColumn('varchar', { length: 16 })
  memberCode: string;

  @Column('varchar', { length: 32 })
  roomId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Member, (member) => member.MemberConnectInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'memberCode', referencedColumnName: 'memberCode' })
  Member: Member;
}

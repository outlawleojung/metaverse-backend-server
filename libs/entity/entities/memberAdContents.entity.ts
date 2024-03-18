import { CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { Member } from './member.entity';
import { AdContents } from './adContents.entity';

@Index('contentsId', ['contentsId'], {})
@Entity('member_ad_contents')
export class MemberAdContents {
  @PrimaryColumn('varchar', { name: 'memberId', length: 100 })
  memberId: string;

  @PrimaryColumn('int', { name: 'contentsId' })
  contentsId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Member, (member) => member.MemberAdContents, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'memberId', referencedColumnName: 'memberId' }])
  Member: Member;

  @ManyToOne(() => AdContents, (c) => c.MemberAdContents, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'contentsId', referencedColumnName: 'id' }])
  AdContents: AdContents;
}

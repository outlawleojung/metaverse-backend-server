import {
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Member } from './member.entity';
import { Postbox } from './postbox.entity';

@Index('postboxId', ['postboxId'], {})
@Entity('post_receive_member_info')
export class PostReceiveMemberInfo {
  @PrimaryColumn('uuid')
  memberId: string;

  @PrimaryColumn('int', { name: 'postboxId' })
  postboxId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Member, (member) => member.PostReceiveMemberInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'memberId' }])
  Member: Member;

  @ManyToOne(() => Postbox, (postbox) => postbox.PostReceiveMemberInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'postboxId', referencedColumnName: 'id' }])
  Postbox: Postbox;
}

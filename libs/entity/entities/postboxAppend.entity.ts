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
import { Postbox } from './postbox.entity';
import { AppendType } from './appendType.entity';

@Index('postboxId', ['postboxId'], {})
@Index('appendType', ['appendType'], {})
@Entity('postbox_append')
export class PostboxAppend {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'postboxId' })
  postboxId: number;

  @Column('int', { name: 'appendType' })
  appendType: number;

  @Column('int', { name: 'appendValue' })
  appendValue: number;

  @Column('int', { name: 'count' })
  count: number;

  @Column('int', { name: 'orderNum' })
  orderNum: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Postbox, (box) => box.PostboxAppend, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'postboxId', referencedColumnName: 'id' }])
  Postbox: Postbox;

  @ManyToOne(() => AppendType, (type) => type.PostboxAppends, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'appendType', referencedColumnName: 'type' }])
  AppendType: AppendType;
}

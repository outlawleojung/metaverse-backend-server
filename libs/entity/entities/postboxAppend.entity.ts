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
import { BaseModelEntity } from './baseModelEntity.entity';

@Index('postboxId', ['postboxId'], {})
@Index('appendType', ['appendType'], {})
@Entity('postbox_append')
export class PostboxAppend extends BaseModelEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column('int')
  postboxId: number;

  @Column('int')
  appendType: number;

  @Column('int')
  appendValue: number;

  @Column('int')
  count: number;

  @Column('int')
  orderNum: number;

  @OneToOne(() => Postbox, (box) => box.PostboxAppend, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'postboxId' })
  Postbox: Postbox;

  @ManyToOne(() => AppendType, (type) => type.PostboxAppends, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'appendType' })
  AppendType: AppendType;
}

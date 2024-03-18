import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AppendType } from './appendType.entity';
import { SystemPostbox } from './systemPostbox.entity';

@Index('postboxId', ['postboxId'], {})
@Index('appendType', ['appendType'], {})
@Entity('system_postbox_append')
export class SystemPostboxAppend {
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

  @ManyToOne(() => SystemPostbox, (box) => box.SystemPostboxAppends, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'postboxId', referencedColumnName: 'id' }])
  SystemPostbox: SystemPostbox;

  @ManyToOne(() => AppendType, (type) => type.PostboxAppends, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'appendType', referencedColumnName: 'type' }])
  AppendType: AppendType;
}

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
import { BaseModelEntity } from './baseModelEntity.entity';

@Index('postboxId', ['postboxId'], {})
@Index('appendType', ['appendType'], {})
@Entity('system_postbox_append')
export class SystemPostboxAppend extends BaseModelEntity {
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

  @ManyToOne(() => SystemPostbox, (box) => box.SystemPostboxAppends, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'postboxId' })
  SystemPostbox: SystemPostbox;

  @ManyToOne(() => AppendType, (type) => type.PostboxAppends, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'appendType' })
  AppendType: AppendType;
}

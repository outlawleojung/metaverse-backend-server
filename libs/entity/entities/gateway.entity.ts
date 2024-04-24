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
import { OsType } from './osType.entity';
import { ServerType } from './serverType.entity';
import { ServerState } from './serverState.entity';
import { StateMessage } from './stateMessage.entity';
import { Admin } from './admin.entity';

@Index('serverType', ['serverType'], {})
@Index('stateType', ['stateType'], {})
@Index('adminId', ['adminId'], {})
@Index('msgId', ['msgId'], {})
@Entity('gateway')
export class Gateway {
  @PrimaryColumn('int')
  osType: number;

  @PrimaryColumn('varchar', { length: 16 })
  appVersion: string;

  @Column('int')
  serverType: number;

  @Column('int')
  stateType: number;

  @Column('int', { default: 1 })
  msgId: number;

  @Column({ nullable: true })
  adminId: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => OsType, (ostype) => ostype.gateways, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'osType' })
  OsType: OsType;

  @ManyToOne(() => ServerType, (servertype) => servertype.gateways, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'serverType' })
  ServerType: ServerType;

  @ManyToOne(() => ServerState, (serverstate) => serverstate.gateways, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'stateType' })
  ServerState: ServerState;

  @ManyToOne(() => Admin, (admin) => admin.gateways, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'adminId' })
  admin: Admin;

  @ManyToOne(() => StateMessage, (statemessage) => statemessage.gateways, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'msgId' })
  StateMessage: StateMessage;
}

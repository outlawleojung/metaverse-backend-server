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
  @PrimaryColumn('int', { name: 'osType' })
  osType: number;

  @PrimaryColumn('varchar', { name: 'appVersion', length: 30 })
  appVersion: string;

  @Column('int', { name: 'serverType' })
  serverType: number;

  @Column('int', { name: 'stateType' })
  stateType: number;

  @Column('int', { name: 'msgId', default: () => "'1'" })
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
  @JoinColumn([{ name: 'osType', referencedColumnName: 'type' }])
  OsType: OsType;

  @ManyToOne(() => ServerType, (servertype) => servertype.gateways, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'serverType', referencedColumnName: 'type' }])
  ServerType: ServerType;

  @ManyToOne(() => ServerState, (serverstate) => serverstate.gateways, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'stateType', referencedColumnName: 'state' }])
  ServerState: ServerState;

  @ManyToOne(() => Admin, (admin) => admin.gateways, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'adminId' }])
  admin: Admin;

  @ManyToOne(() => StateMessage, (statemessage) => statemessage.gateways, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'msgId', referencedColumnName: 'id' }])
  StateMessage: StateMessage;
}

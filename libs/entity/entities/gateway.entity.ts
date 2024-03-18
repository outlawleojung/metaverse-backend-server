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
import { User } from './user.entity';
import { StateMessage } from './stateMessage.entity';

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

  @Column('int', { name: 'adminId', nullable: true })
  adminId: number | null;

  @Column('int', { name: 'msgId', default: () => "'1'" })
  msgId: number;

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

  @ManyToOne(() => User, (user) => user.gateways, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'adminId', referencedColumnName: 'id' }])
  Admin: User;

  @ManyToOne(() => StateMessage, (statemessage) => statemessage.gateways, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'msgId', referencedColumnName: 'id' }])
  StateMessage: StateMessage;
}

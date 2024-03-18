import { Column, Entity, Index, OneToMany, PrimaryColumn } from 'typeorm';
import { Gateway } from './gateway.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('server_state')
export class ServerState {
  @PrimaryColumn('int', { name: 'state' })
  state: number;

  @ApiProperty({
    example: '활성',
    description: '서버 상태',
  })
  @Column('varchar', { name: 'name', length: 64 })
  name: string;

  @OneToMany(() => Gateway, (gateway) => gateway.stateType)
  gateways: Gateway[];
}

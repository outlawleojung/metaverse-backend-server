import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Gateway } from './gateway.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('state_message')
export class StateMessage {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @ApiProperty({
    example: '점검 중',
    description: '상태 메세지 종류',
  })
  @Column('varchar', { name: 'message', length: 200 })
  message: string;

  @OneToMany(() => Gateway, (gateway) => gateway.StateMessage)
  gateways: Gateway[];
}

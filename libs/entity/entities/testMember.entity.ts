import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseModelEntity } from './baseModelEntity.entity';

@Entity('test_member')
export class TestMember extends BaseModelEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column('varchar', { nullable: true, length: 100 })
  deviceId: string | null;
}

import { Entity, OneToMany } from 'typeorm';
import { Member } from './member.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('my_room_state_type')
export class MyRoomStateType extends BaseTypeEntity {
  @OneToMany(() => Member, (member) => member.MyRoomStateType)
  Members: Member[];
}

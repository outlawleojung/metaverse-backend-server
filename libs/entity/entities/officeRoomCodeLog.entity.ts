import { CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity('office_room_code_log')
export class OfficeRoomCodeLog {
  @PrimaryColumn('varchar', { length: 20 })
  roomCode: string;

  @CreateDateColumn()
  createdAt: Date;
}

import { IRoom } from '../room';

import { RoomType } from '../room-type';

export interface GameRoomRoomDetails {
  type: RoomType;
  roomId: string;
  sceneName: string;
}

export class GameRoom implements IRoom {
  roomId: string;
  type: RoomType;
  sceneName: string;

  constructor(details: GameRoomRoomDetails) {
    Object.assign(this, details);
  }
}

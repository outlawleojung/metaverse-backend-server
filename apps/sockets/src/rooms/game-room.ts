import { IRoomWithOwner, IRoomWithPlaying } from '../room/room';

import { RoomType } from '../room/room-type';

export interface GameRoomRoomDetails {
  ownerId: string;
  roomId: string;
  roomName: string;
  sceneName: string;
}

export class GameRoom implements IRoomWithOwner, IRoomWithPlaying {
  roomCode: string;
  isPlaying: boolean;
  ownerId: string;
  roomId: string;
  type: RoomType;
  sceneName: string;

  constructor(details: GameRoomRoomDetails) {
    this.type = RoomType.Game;
    Object.assign(this, details);
  }
}

import { RoomType } from './room-type';

export interface IRoom {
  roomId: string;
  type: RoomType;
  sceneName: string;
}

export interface IRoomWithCode extends IRoom {
  roomCode: string;
}

export interface IRoomWithOwner extends IRoom {
  ownerId: string;
}

export interface IRoomWithPlaying extends IRoom {
  roomCode: string;
  isPlaying: boolean;
}

// export abstract class Room implements IRoom {
//   type: RoomType;
//   sceneName: string;
//   roomId: string;

//   constructor(roomId: string, type: RoomType, sceneName: string) {
//     this.roomId = roomId;
//     this.type = type;
//     this.sceneName = sceneName;
//   }
// }

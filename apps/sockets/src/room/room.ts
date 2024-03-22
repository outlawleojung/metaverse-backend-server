import { RoomType } from './room-type';

export interface IRoom {
  roomId: string;
  type: RoomType;
  sceneName: string;
  roomCode?: string;
  ownerId?: string;

  // join(clientId: string): { isEnterSucceed: boolean; errorCode: string };
  // leave(clientId: string): void;
  // broadcast(event: string, data: any): void;
}

export abstract class Room implements IRoom {
  type: RoomType;
  sceneName: string;
  roomId: string;

  constructor(roomId: string, type: RoomType, sceneName: string) {
    this.roomId = roomId;
    this.type = type;
    this.sceneName = sceneName;
  }

  // abstract join(clientId: string): {
  //   isEnterSucceed: boolean;
  //   errorCode: string;
  // };
  // abstract leave(clientId: string): void;
  // abstract broadcast(event: string, data: any): void;
}

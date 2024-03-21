import { Logger } from '@nestjs/common';
import { Room } from '../room/room';
import { RoomService } from '../room/room.service';

export class MyRoom extends Room {
  ownerId: string;
  ownerNickname: string;
  ownerAvatarInfo: any;
  myroomInfo: string;
  isShutdown: boolean;

  constructor(roomId, roomType, sceneName, ownerId, roomService: RoomService) {
    super(roomId, roomType, sceneName);

    this.ownerId = ownerId;
    roomService.indexRoom(this);
  }

  join(clientId: string) {
    console.log(`My Room Join : ${clientId}`);
  }

  leave(clientId: string) {
    console.log(`My Room Leave : ${clientId}`);
  }
  broadcast(event: string, data: any) {
    console.log(`My Room broadcast : ${event} - ${data}`);
  }
}

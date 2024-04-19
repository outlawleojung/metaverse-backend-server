import { Socket } from 'socket.io';

interface SocketData {
  memberId: string;
  clientId: string;
  objectId: string;
  jwtAccessToken: string;
  nickname: string;
  roomId: string;
  roomCode: string;
  roomName: string;
  stateMessage: string;
  socketId: string;
  sessionId: string;
}

export interface CustomSocket extends Socket {
  data: SocketData;
}

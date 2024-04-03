import { Socket } from 'socket.io';

interface SocketData {
  memberId: string;
  clientId: string;
  jwtAccessToken: string;
  sessionId: string;
  nickname: string;
  roomId: string;
  roomCode: string;
  roomName: string;
  stateMessage: string;
}

export interface CustomSocket extends Socket {
  data: SocketData;
}

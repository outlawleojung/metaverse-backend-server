import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class ClientService {
  constructor() {}
  socketMap: Map<string, Socket> = new Map();

  async setSocket(clientId: string, socket: Socket) {
    await this.socketMap.set(clientId, socket);
  }

  async getSocket(clientId: string): Promise<Socket> {
    return await this.socketMap.get(clientId);
  }
}

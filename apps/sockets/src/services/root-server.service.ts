import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { ManagerGateway } from '../manager/manager.gateway';

@Injectable()
export class RootServerService {
  constructor(private readonly managerGateway: ManagerGateway) {}

  public getServer(): Server {
    return this.managerGateway.getServer();
  }
}

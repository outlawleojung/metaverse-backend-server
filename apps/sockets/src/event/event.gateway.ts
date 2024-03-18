import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { instrument } from '@socket.io/admin-ui';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventGateway {
  @WebSocketServer()
  server: Server;

  afterInit() {
    instrument(this.server, {
      auth: false,
      mode: 'development',
    });
  }
}

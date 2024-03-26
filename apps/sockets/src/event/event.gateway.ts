import {
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { instrument } from '@socket.io/admin-ui';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  afterInit() {
    console.log(
      '@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ eventGateway @@@@@@@@@@@@@@@@@@@@@@@@',
    );
    instrument(this.server, {
      auth: false,
      mode: 'development',
      namespaceName: '/admin',
    });
  }
}

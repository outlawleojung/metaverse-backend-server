import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Catch()
export class WsExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToWs();
    const client = ctx.getClient<Socket>();

    let message: string | object = 'Internal server error';
    if (exception instanceof WsException) {
      message = exception.getError();
    } else if (exception instanceof BadRequestException) {
      // BadRequestException의 경우, message를 커스터마이즈 할 수 있습니다.
      message = exception.getResponse();
    }
    // 클라이언트에 에러 메시지를 emit
    client.emit('ERROR', { message });
  }
}

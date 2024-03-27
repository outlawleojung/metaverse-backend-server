import { Injectable } from '@nestjs/common';
import { OfficeGateway } from './office.gateway';
import { NATS_EVENTS } from '@libs/constants';
import { NatsMessageHandler } from '../nats/nats-message.handler';

@Injectable()
export class OfficeWebService {
  constructor(
    private readonly officeGateway: OfficeGateway,
    private readonly messageHandler: NatsMessageHandler,
  ) {}

  // 실시간 서버 회의실 방 생성 알림 API
  async crreateOfficeRoom(roomCode: number) {
    console.log(`createOfficeRoom : ${roomCode}`);
    this.messageHandler.publishHandler(
      NATS_EVENTS.CREATE_OFFICE,
      String(roomCode),
    );
    return 'success';
  }

  // 실시간 서버 회의실 방 삭제 알림 API
  async deleteOfficeRoom(roomCode: number) {
    console.log(`deleteOfficeRoom : ${roomCode}`);
    this.messageHandler.publishHandler(
      NATS_EVENTS.DELETE_OFFICE,
      String(roomCode),
    );
    return 'success';
  }
}

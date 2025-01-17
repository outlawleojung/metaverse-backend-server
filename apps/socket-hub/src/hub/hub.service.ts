import {
  HUB_SOCKET_ROOM,
  HUB_SOCKET_S_MESSAGE,
  NAMESPACE,
} from '@libs/constants';
import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { HubGateway } from './hub.gateway';

@Injectable()
export class HubService {
  constructor(
    @Inject(forwardRef(() => HubGateway))
    private readonly hubGateway: HubGateway,
  ) {}

  private readonly logger = new Logger(HubService.name);

  // PlayerGateway 소켓 Map
  private playerSocketMap = new Map();
  getSocket(gatewayId: string) {
    return this.playerSocketMap.get(gatewayId);
  }

  // 요청한 게임 오브젝트 저장용
  private objects: Map<string, object[]> = new Map();

  // 요청한 인터랙션 저장용
  private interactions: Map<string, object[]> = new Map();

  // 요청에 따른 응답 체크 저장용
  private requests: Map<string, number> = new Map();

  // 요청 아이디와 소켓을 저장
  private requestSocket: Map<string, Socket> = new Map();

  async handleConnection(client: Socket, gatewayId: string) {
    this.logger.debug(`허브 서버 소켓 연결 ✅`, gatewayId);

    client.data.gatewayId = gatewayId;
    client.join(HUB_SOCKET_ROOM.GAMEOBJECT);

    const gatewayIdArray = gatewayId.split(':');
    const gatewayName = gatewayIdArray[0];

    if (gatewayName === NAMESPACE.PLAYER) {
      this.playerSocketMap.set(gatewayId, client);
    }
  }

  async handleDisconnect(client: Socket) {
    this.logger.debug(`허브 서버 소켓 해제 ❌`, client.data.gatewayId);
    this.playerSocketMap.delete(client.data.gatewayId);
    client.leave(HUB_SOCKET_ROOM.GAMEOBJECT);
  }

  // 게임 오브젝트 목록 조회 요청
  async getGameObjects(client: Socket, packet: any) {
    console.log('getGameObjects: ', JSON.stringify(packet));

    this.requestSocket.set(packet.requestId, client);

    this.hubGateway
      .getServer()
      .to(HUB_SOCKET_ROOM.GAMEOBJECT)
      .emit(HUB_SOCKET_S_MESSAGE.S_GET_GAMEOBJECTS, packet);
  }

  // 게이트웨이에서 보내 온 게임오브젝트 목록
  async setGameObjects(client: Socket, packet: any) {
    const requestId = packet.requestId;
    const gameObjects = packet.gameObjects;

    if (this.objects.has(requestId)) {
      const existingObjects = this.objects.get(requestId);
      existingObjects.push(...gameObjects);
      this.objects.set(requestId, existingObjects);
    } else {
      // requestId에 해당하는 항목이 맵에 없으면 새로운 항목을 추가
      this.objects.set(requestId, gameObjects);
    }

    if (this.requests.has(requestId)) {
      let count = this.requests.get(requestId);
      count += 1;
      this.requests.set(requestId, count);
    } else {
      this.requests.set(requestId, 1);
    }

    // 모든 요청에 대한 응답이 다 왔다면
    if (this.playerSocketMap.size === this.requests.get(requestId)) {
      const socket = this.requestSocket.get(requestId);
      socket.emit(HUB_SOCKET_S_MESSAGE.S_GAMEOBJECTS_RESULT, {
        requestId,
        gameObjects: this.objects.get(requestId),
      });

      console.log('게임오브젝트 요청 응답:', this.objects.get(requestId));

      this.objects.delete(requestId);
      this.requests.delete(requestId);
      this.requestSocket.delete(requestId);
    }
  }

  // 인터랙션 목록 조회 요청
  async getInteractions(client: Socket, packet: any) {
    console.log('getInteractions: ', JSON.stringify(packet));

    this.requestSocket.set(packet.requestId, client);

    this.hubGateway
      .getServer()
      .to(HUB_SOCKET_ROOM.GAMEOBJECT)
      .emit(HUB_SOCKET_S_MESSAGE.S_GET_INTERACTIONS, packet);
  }

  // 게이트웨이에서 보내 온 인터랙션 목록
  async setInteractions(client: Socket, packet: any) {
    const requestId = packet.requestId;
    const interactions = packet.interactions;

    if (this.interactions.has(requestId)) {
      const exInteractions = this.interactions.get(requestId);
      exInteractions.push(...interactions);
      this.interactions.set(requestId, exInteractions);
    } else {
      // requestId에 해당하는 항목이 맵에 없으면 새로운 항목을 추가
      this.interactions.set(requestId, interactions);
    }

    if (this.requests.has(requestId)) {
      let count = this.requests.get(requestId);
      count += 1;
      this.requests.set(requestId, count);
    } else {
      this.requests.set(requestId, 1);
    }

    // 모든 요청에 대한 응답이 다 왔다면
    if (this.playerSocketMap.size === this.requests.get(requestId)) {
      const socket = this.requestSocket.get(requestId);
      socket.emit(HUB_SOCKET_S_MESSAGE.S_INTERACTIONS_RESULT, {
        requestId,
        interactions: this.interactions.get(requestId),
      });

      console.log('인터렉션 요청 응답:', this.interactions.get(requestId));

      this.interactions.delete(requestId);
      this.requests.delete(requestId);
      this.requestSocket.delete(requestId);
    }
  }

  // 게이트웨이에서 보내 온 결과
  async setIsExistsGameObject(client: Socket, packet: any) {
    const requestId = packet.requestId;
    const isExists = packet.isExists;

    if (isExists) {
      const socket = this.requestSocket.get(requestId);
      socket.emit(HUB_SOCKET_S_MESSAGE.S_GAMEOBJECTS_RESULT, {
        requestId,
        isExists,
      });

      this.requests.delete(requestId);
      this.requestSocket.delete(requestId);
    }
  }
}

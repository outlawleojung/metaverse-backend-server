import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { GameObject } from './game-object';
import {
  C_BASE_INSTANTIATE_OBJECT,
  S_INTERACTION_SET_ITEM,
  S_INTERACTION_SET_ITEM_NOTICE,
  S_INTERACTION_GET_ITEMS,
  S_INTERACTION_REMOVE_ITEM,
  S_INTERACTION_REMOVE_ITEM_NOTICE,
  S_BASE_REMOVE_OBJECT,
  S_BASE_SET_ANIMATION,
  S_BASE_SET_ANIMATION_ONCE,
  S_BASE_INSTANTIATE_OBJECT,
  S_BASE_ADD_OBJECT,
  S_BASE_SET_TRANSFORM,
} from '../packets/packet';
import { Position, Rotation } from '../packets/packet-interface';
import { Server, Socket } from 'socket.io';
import { RedisKey, SOCKET_S_GLOBAL } from '@libs/constants';
import { RedisLockService } from '../../services/redis-lock.service';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { PlayerService } from '../player.service';
import { NatsMessageHandler } from '../../nats/nats-message.handler';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class GameObjectService {
  private logger = new Logger(GameObjectService.name);
  private gameObjects: Map<string, Map<number, GameObject>> = new Map();
  private interactions: Map<string, string> = new Map();

  constructor(
    @InjectRedis() private readonly redisClient: Redis,
    @Inject(forwardRef(() => PlayerService))
    private readonly playerService: PlayerService,
    private readonly lockService: RedisLockService,
    private readonly messageHandler: NatsMessageHandler,
  ) {}

  async instantiateObject(
    server: Server,
    client: Socket,
    roomId: string,
    data: C_BASE_INSTANTIATE_OBJECT,
  ) {
    const clientId = client.data.clientId;

    const objectId = await this.generateObjectId();
    const gameObject = new GameObject(
      objectId,
      data.prefabName,
      data.position,
      data.rotation,
      data.objectData,
      clientId,
    );

    if (this.gameObjects.has(roomId)) {
      const exGameObjects = this.gameObjects.get(roomId);

      exGameObjects.set(objectId, gameObject);
      this.gameObjects.set(roomId, exGameObjects);
    } else {
      const roomGameObjects = new Map();
      roomGameObjects.set(objectId, gameObject);
      this.gameObjects.set(roomId, roomGameObjects);
    }

    {
      const packet = new S_BASE_INSTANTIATE_OBJECT();
      packet.success = true;
      packet.objectId = gameObject.objectId;

      const { event, ...packatData } = packet;
      client.emit(event, packatData);
    }
    {
      const addObjectPacket = new S_BASE_ADD_OBJECT();
      addObjectPacket.gameObjects.push(gameObject);

      const { event, ...packetData } = addObjectPacket;

      server.to(roomId).emit(event, packetData);

      client.data.objectId = objectId;
    }
  }

  // 게임 오브젝트 조회 ( Hub)
  async getObjectsForHub(roomId: string) {
    const gameObjects: GameObject[] = [];
    const roomGameObjects = await this.gameObjects.get(roomId);

    if (roomGameObjects) {
      for (const gameObject of roomGameObjects.values()) {
        gameObjects.push(gameObject);
      }
    }

    return gameObjects;
  }

  setObjectData(roomId: string, objectId: number, data: string) {
    const roomGameObjects = this.gameObjects.get(roomId);

    if (!roomGameObjects) {
      // 오브젝트 없음.
      return;
    }

    const gameObject = roomGameObjects.get(objectId);

    if (!gameObject) {
      // 오브젝트 없음.
      return;
    }
    gameObject.objectData = data;

    // 클라이언트에 변경 사항 전송 등의 추가 작업
  }

  removeGameObject(roomId: string, clientId: string) {
    const roomGameObjects = this.gameObjects.get(roomId);

    if (roomGameObjects) {
      const deleteObjectIds: number[] = [];
      for (const gameObject of roomGameObjects.values()) {
        if (gameObject.ownerId === clientId) {
          deleteObjectIds.push(gameObject.objectId);
        }
      }

      this.logger.debug('게임 오브젝트 삭제 : ', deleteObjectIds);
      deleteObjectIds.forEach((id) => roomGameObjects.delete(id));

      {
        const roomGameObjects = this.gameObjects.get(roomId);
        if (!roomGameObjects || roomGameObjects.size === 0) {
          this.gameObjects.delete(roomId);
        }
      }
    }
  }

  setTransform(
    roomId: string,
    objectId: number,
    position: Position,
    rotation: Rotation,
  ) {
    const roomGameObjects = this.gameObjects.get(roomId);

    if (!roomGameObjects) {
      // 오브젝트 없음.
      return {
        event: SOCKET_S_GLOBAL.S_ERROR,
        packetData: SOCKET_S_GLOBAL.S_ERROR,
      };
    }

    const gameObject = roomGameObjects.get(objectId);

    if (!gameObject) {
      // 오브젝트 없음.
      return {
        event: SOCKET_S_GLOBAL.S_ERROR,
        packetData: SOCKET_S_GLOBAL.S_ERROR,
      };
    }

    gameObject.setPosition(position);
    gameObject.setRotation(rotation);

    // 클라이언트에 변경 사항 전송 등의 추가 작업
    const packet = new S_BASE_SET_TRANSFORM();
    packet.objectId = objectId;
    packet.position = position;
    packet.rotation = rotation;

    const { event, ...packetData } = packet;

    return { event, packetData };
  }

  setAnimation(
    roomId: string,
    objectId: number,
    animationId: string,
    animationValue: string,
  ) {
    const roomGameObjects = this.gameObjects.get(roomId);

    if (!roomGameObjects) {
      // 오브젝트 없음.
      return {
        event: SOCKET_S_GLOBAL.S_ERROR,
        packetData: SOCKET_S_GLOBAL.S_ERROR,
      };
    }

    const gameObject = roomGameObjects.get(objectId);

    if (!gameObject) {
      // 오브젝트 없음.
      return {
        event: SOCKET_S_GLOBAL.S_ERROR,
        packetData: SOCKET_S_GLOBAL.S_ERROR,
      };
    }

    gameObject.setAnimations(animationId, animationValue);

    const packet = new S_BASE_SET_ANIMATION();
    packet.objectId = objectId;
    packet.animationId = animationId;
    packet.animation = animationValue;

    const { event, ...packetData } = packet;

    return { event, packetData };
  }

  setAnimationOnce(
    roomId: string,
    objectId: number,
    animationId: string,
    isLoop: boolean,
    blend: number,
  ) {
    const roomGameObjects = this.gameObjects.get(roomId);

    if (!roomGameObjects) {
      // 오브젝트 없음.
      return {
        event: SOCKET_S_GLOBAL.S_ERROR,
        packetData: SOCKET_S_GLOBAL.S_ERROR,
      };
    }

    const gameObject = roomGameObjects.get(objectId);

    if (!gameObject) {
      // 오브젝트 없음.
      return {
        event: SOCKET_S_GLOBAL.S_ERROR,
        packetData: SOCKET_S_GLOBAL.S_ERROR,
      };
    }

    const packet = new S_BASE_SET_ANIMATION_ONCE();
    packet.objectId = objectId;
    packet.animationId = animationId;
    packet.isLoop = isLoop;
    packet.blend = blend;

    const { event, ...packetData } = packet;

    return { event, packetData };
  }

  getInteraction(roomId: string, client: Socket) {
    const packet = new S_INTERACTION_GET_ITEMS();
    this.interactions.forEach((id) => {
      packet.items.push({ id, state: '' });
    });

    const { event, ...packetData } = packet;

    this.logger.debug(
      `getInteraction - roomId: ${roomId} event: ${event} data: ${packetData}`,
    );
    client.emit(event, packetData);
  }

  setInteraction(
    roomId: string,
    client: Socket,
    interactionId: string,
    interactionData: string,
  ) {
    const packet = new S_INTERACTION_SET_ITEM();

    const interaction = this.interactions.get(interactionId);
    if (interaction && interaction != client.data.clientId) {
      packet.success = false;

      const { event, ...packetData } = packet;
      client.emit(event, packetData);
      this.logger.debug(`setInteraction : ${event} - ${packetData}`);

      return;
    }

    packet.success = true;

    this.interactions.set(interactionId, client.data.clientId);

    {
      const { event, ...packetData } = packet;

      client.emit(event, packetData);
    }
    {
      const packet = new S_INTERACTION_SET_ITEM_NOTICE();
      packet.id = interactionId;
      packet.state = interactionData;

      const { event, ...packetData } = packet;

      this.logger.debug(
        `Interaction Broadcast - roomId: ${roomId} event: ${event} data: ${packetData}`,
      );
    }
  }

  removeInteraction(roomId: string, client: Socket, interactionId: string) {
    {
      const packet = new S_INTERACTION_REMOVE_ITEM();

      const interaction = this.interactions.get(interactionId);
      if (interaction && interaction != client.data.clientId) {
        packet.success = false;

        const { event, ...packetData } = packet;
        client.emit(event, packetData);
        this.logger.debug(
          `removeInteraction - roomId: ${roomId} event: ${event} data: ${packetData}`,
        );

        return;
      }

      packet.success = true;

      this.interactions.delete(interactionId);

      const { event, ...packetData } = packet;

      client.emit(event, packetData);
    }
    {
      const packet = new S_INTERACTION_REMOVE_ITEM_NOTICE();
      packet.id = interactionId;

      const { event, ...packetData } = packet;

      this.logger.debug(
        `removeInteraction - roomId: ${roomId} event: ${event} data: ${packetData}`,
      );
    }
  }

  clearObject(roomId: string) {
    const packet = new S_BASE_REMOVE_OBJECT();

    const roomGameObjects = this.gameObjects.get(roomId);

    if (!roomGameObjects) {
      // 오브젝트 없음.
      return;
    }

    for (const key of roomGameObjects.keys()) {
      packet.gameObjects.push(key);
    }

    const { event, ...packetData } = packet;
    this.logger.debug(
      `Remove GameObject Broadcast - roomId: ${roomId} event: ${event} data: ${packetData}`,
    );

    this.gameObjects.clear();
  }

  private async generateObjectId(): Promise<number> {
    const lockKey = RedisKey.getStrRedisLockKey('objectId');
    if (await this.lockService.tryLock(lockKey, 30000)) {
      try {
        const objectId = await this.redisClient.incr(
          RedisKey.getStrObjectIdCounter(),
        );
        this.logger.debug(`Object Id 생성 ✅ ${objectId} `);
        return objectId;
      } catch (err) {
        this.logger.error(`오브젝트 아이디 생성 오류 발생 ❌`, err);
        throw new ForbiddenException('오브젝트 아이디 생성 오류 발생 ❌');
      } finally {
        await this.lockService.releaseLock(lockKey);
      }
    }
  }

  @Cron('* * * * * *') // 매초 실행
  async handleCron() {
    // 변경된 GameObject 데이터가 있는지 확인
    // this.updateRedisDataWithLock();
    // 변경된 데이터가 있다면 Redis와 동기화
    // 예시 로직: Redis에 저장된 데이터를 업데이트
    // const gameObjects = this.getUpdatedGameObjects(); // 변경된 GameObjects를 가져오는 메서드
    // if (gameObjects.length > 0) {
    //   await this.redisClient.set('gameObjectsKey', JSON.stringify(gameObjects));
    // }
  }

  async updateRedisDataWithLock() {
    const lockKey = RedisKey.getStrObjectRedisLockKey('gameObject');
    const maxRetries = 10; // 최대 재시도 횟수
    const retryDelay = 1000; // 재시도 딜레이 (밀리초)

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      const isLocked = await this.lockService.tryLock(lockKey, 30000); // Lock 획득 시도, 30초간 유지
      if (isLocked) {
        try {
          // Lock 획득 성공, Redis 데이터 업데이트 로직 수행
          console.log('Redis 데이터 업데이트 시작');
          // 여기에 Redis 업데이트 로직을 추가합니다.
          return; // 업데이트 성공 후 함수 종료
        } finally {
          await this.lockService.releaseLock(lockKey); // 작업 완료 후 Lock 해제
          console.log('Redis 데이터 업데이트 완료 및 Lock 해제');
        }
      } else {
        console.log(`Lock 획득 실패, ${attempt + 1}번째 재시도...`);
        await new Promise((resolve) => setTimeout(resolve, retryDelay)); // 재시도 딜레이
      }
    }

    console.log('최대 재시도 횟수 초과, 데이터 업데이트 실패');
  }
}

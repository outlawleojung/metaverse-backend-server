import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { GameObject } from './game-object';
import {
  C_BASE_INSTANTIATE_OBJECT,
  S_INTERACTION_SET_ITEM,
  S_INTERACTION_SET_ITEM_NOTICE,
  S_INTERACTION_REMOVE_ITEM,
  S_INTERACTION_REMOVE_ITEM_NOTICE,
  S_BASE_REMOVE_OBJECT,
  S_BASE_SET_ANIMATION,
  S_BASE_SET_ANIMATION_ONCE,
  S_BASE_INSTANTIATE_OBJECT,
  S_BASE_ADD_OBJECT,
  S_BASE_SET_TRANSFORM,
} from '../packets/packet';
import { PacketInfo, Position, Rotation } from '../packets/packet-interface';
import { RedisKey, SOCKET_S_GLOBAL } from '@libs/constants';
import { RedisLockService } from '../services/redis-lock.service';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { NatsMessageHandler } from '../nats/nats-message.handler';

@Injectable()
export class GameObjectService {
  private logger = new Logger(GameObjectService.name);
  private gameObjects: Map<string, Map<number, GameObject>> = new Map();
  private interactions: Map<string, Map<string, string>> = new Map();

  constructor(
    @InjectRedis() private readonly redisClient: Redis,
    private readonly lockService: RedisLockService,
    private readonly messageHandler: NatsMessageHandler,
  ) {}

  async instantiateObject(
    roomId: string,
    clientId: string,
    data: C_BASE_INSTANTIATE_OBJECT,
  ) {
    const objectId = await this.generateObjectId();
    const gameObject = new GameObject(
      objectId,
      data.prefabName,
      data.position,
      data.rotation,
      data.objectData,
      clientId,
    );

    const response: any = {};

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

      const { eventName, ...packetData } = packet;

      const packetInfo: PacketInfo = {
        eventName,
        packetData: packetData,
      };
      response.clientPacket = packetInfo;
    }
    {
      const addObjectPacket = new S_BASE_ADD_OBJECT();
      addObjectPacket.gameObjects.push(gameObject);

      const { eventName, ...packetData } = addObjectPacket;
      const packetInfo: PacketInfo = {
        eventName,
        packetData: packetData,
      };
      response.broadcastPacket = packetInfo;
    }
    response.objectId = objectId;
    return response;
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

  // 인터랙션 조회 ( Hub)
  async getInteractionForHub(roomId: string) {
    const roomInteractions = await this.interactions.get(roomId);
    const interactions: string[] = [];
    if (roomInteractions) {
      if (roomInteractions) {
        for (const interaction of roomInteractions.keys()) {
          interactions.push(interaction);
        }
      }
    }
    return interactions;
  }

  // 게임 오브젝트 존재 여부 조회
  async getExistsGameObject(roomId: string, objectId: number) {
    const roomGameObjects = await this.gameObjects.get(roomId);

    if (roomGameObjects) {
      for (const gameObjectId of roomGameObjects.keys()) {
        if (gameObjectId === objectId) {
          return true;
        }
      }
    }

    return false;
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
  }

  removeGameObject(roomId: string, clientId: string): number[] {
    const roomGameObjects = this.gameObjects.get(roomId);

    const deleteObjectIds: number[] = [];
    if (roomGameObjects) {
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

    return deleteObjectIds;
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
        event: SOCKET_S_GLOBAL.ERROR,
        packetData: '오브젝트 없음',
      };
    }

    const gameObject = roomGameObjects.get(objectId);

    if (!gameObject) {
      // 오브젝트 없음.
      return {
        event: SOCKET_S_GLOBAL.ERROR,
        packetData: '오브젝트 없음',
      };
    }

    gameObject.setPosition(position);
    gameObject.setRotation(rotation);

    // 클라이언트에 변경 사항 전송 등의 추가 작업
    const packet = new S_BASE_SET_TRANSFORM();
    packet.objectId = objectId;
    packet.position = position;
    packet.rotation = rotation;

    const { eventName, ...packetData } = packet;

    return { eventName, packetData };
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
        event: SOCKET_S_GLOBAL.ERROR,
        packetData: '오브젝트 없음',
      };
    }

    const gameObject = roomGameObjects.get(objectId);

    if (!gameObject) {
      // 오브젝트 없음.
      return {
        event: SOCKET_S_GLOBAL.ERROR,
        packetData: '오브젝트 없음',
      };
    }

    gameObject.setAnimations(animationId, animationValue);

    const packet = new S_BASE_SET_ANIMATION();
    packet.objectId = objectId;
    packet.animationId = animationId;
    packet.animation = animationValue;

    const { eventName, ...packetData } = packet;

    return { eventName, packetData };
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
        event: SOCKET_S_GLOBAL.ERROR,
        packetData: SOCKET_S_GLOBAL.ERROR,
      };
    }

    const gameObject = roomGameObjects.get(objectId);

    if (!gameObject) {
      // 오브젝트 없음.
      return {
        event: SOCKET_S_GLOBAL.ERROR,
        packetData: SOCKET_S_GLOBAL.ERROR,
      };
    }

    const packet = new S_BASE_SET_ANIMATION_ONCE();
    packet.objectId = objectId;
    packet.animationId = animationId;
    packet.isLoop = isLoop;
    packet.blend = blend;

    const { eventName, ...packetData } = packet;

    return { eventName, packetData };
  }

  setInteraction(
    roomId: string,
    clientId: string,
    interactionId: string,
    interactionData: string,
  ) {
    this.logger.debug('setInteraction 1');
    const packet = new S_INTERACTION_SET_ITEM();
    const response: any = {};

    this.logger.debug('roomId: ', roomId);

    if (this.interactions.has(roomId)) {
      const interactions = this.interactions.get(roomId);

      if (interactions.has(interactionId)) {
        const value = interactions.get(interactionId);

        if (value !== clientId) {
          packet.success = false;

          const { eventName, ...packetData } = packet;

          const packetInfo: PacketInfo = {
            eventName,
            packetData: packetData,
          };

          this.logger.debug(`setInteraction : ${event} - ${packetData}`);
          response.clientPacket = packetInfo;
          return response;
        }
      }
    }

    packet.success = true;

    const exInteractions =
      this.interactions.get(roomId) || new Map<string, string>();

    exInteractions.set(interactionId, clientId);

    this.interactions.set(roomId, exInteractions);

    {
      const { eventName, ...packetData } = packet;

      const packetInfo: PacketInfo = {
        eventName,
        packetData: packetData,
      };

      response.clientPacket = packetInfo;
      this.logger.debug('setInteraction 7');
    }
    {
      const packet = new S_INTERACTION_SET_ITEM_NOTICE();
      packet.id = interactionId;
      packet.state = interactionData;

      const { eventName, ...packetData } = packet;
      const packetInfo: PacketInfo = {
        eventName,
        packetData: packetData,
      };

      this.logger.debug('setInteraction 8');
      response.broadcastPacket = packetInfo;

      this.logger.debug(
        `Interaction Broadcast - roomId: ${roomId} event: ${eventName} data: ${packetData}`,
      );

      return response;
    }
  }

  removeInteraction(roomId: string, clientId: string, interactionId: string) {
    const response: any = {};
    {
      const packet = new S_INTERACTION_REMOVE_ITEM();

      const interactions = this.interactions.get(roomId);
      const interaction = interactions.get(interactionId);
      if (interaction && interaction != clientId) {
        packet.success = false;

        const { eventName, ...packetData } = packet;
        const packetInfo: PacketInfo = {
          eventName,
          packetData: packetData,
        };

        this.logger.debug(
          `removeInteraction - roomId: ${roomId} event: ${event} data: ${packetData}`,
        );

        response.clientPacket = packetInfo;
        return response;
      }

      packet.success = true;

      interactions.delete(interactionId);
      this.interactions.set(roomId, interactions);

      const { eventName, ...packetData } = packet;
      const packetInfo: PacketInfo = {
        eventName,
        packetData: packetData,
      };

      response.clientPacket = packetInfo;
    }
    {
      const packet = new S_INTERACTION_REMOVE_ITEM_NOTICE();
      packet.id = interactionId;

      const { eventName, ...packetData } = packet;
      const packetInfo: PacketInfo = {
        eventName,
        packetData: packetData,
      };
      response.broadcastPacket = packetInfo;

      this.logger.debug(
        `removeInteraction - roomId: ${roomId} event: ${event} data: ${packetData}`,
      );
    }

    return response;
  }

  // 해당 사용자의 모든 인터렉션 목록 삭제
  removeInteractions(roomId: string, clientId: string): string[] {
    const interactions = this.interactions.get(roomId);

    const interactionIds: string[] = [];

    if (interactions) {
      for (const [
        interactionId,
        interactioinClientId,
      ] of interactions.entries()) {
        if (interactioinClientId === clientId) {
          interactionIds.push(interactionId);
        }
      }

      {
        const interactions = this.interactions.get(roomId);
        interactionIds.forEach((interactionId) => {
          if (interactions.has(interactionId)) {
            interactions.delete(interactionId);
          }
        });

        if (!interactions || interactions.size === 0) {
          this.interactions.delete(roomId);
        }
      }
    }

    return interactionIds;
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

    const { eventName, ...packetData } = packet;
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
}

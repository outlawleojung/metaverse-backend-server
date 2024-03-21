import { Injectable, Logger } from '@nestjs/common';
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
} from '../packets/packet';
import { Position, Rotation } from '../packets/packet-interface';
import { Socket } from 'socket.io';

@Injectable()
export class GameObjectService {
  private logger = new Logger(GameObjectService.name);
  private gameObjects: Map<string, Map<number, GameObject>> = new Map();
  private interactions: Map<string, string> = new Map();

  constructor() {}

  instantiateObject(
    client: Socket,
    clientId: string,
    roomId: string,
    data: C_BASE_INSTANTIATE_OBJECT,
  ) {
    const objectId = 0;
    const gameObject = new GameObject(
      objectId,
      data.prefabName,
      data.position,
      data.rotation,
      clientId,
    );

    const roomGameObjects = new Map();
    roomGameObjects.set(objectId, gameObject);
    this.gameObjects.set(roomId, roomGameObjects);

    {
      const packet = new S_BASE_INSTANTIATE_OBJECT();
      packet.success = true;
      packet.objectId = gameObject.objectId;

      const { event, ...packatData } = packet;
      client.emit(event, packatData);
    }
    {
      const addObjectPacket = new S_BASE_ADD_OBJECT();
      addObjectPacket.gameObjects.push({
        objectId: gameObject.objectId,
        position: gameObject.position,
        rotation: gameObject.rotation,
        prefabName: gameObject.prefabName,
        objectData: gameObject.objectData,
        ownerId: gameObject.ownerId,
        animationId: '',
        isLoop: false,
        blend: 0,
      });

      const { event, ...packatData } = addObjectPacket;

      this.logger.debug(
        `instantiateObject Broadcast : ${event} - ${packatData}`,
      );
    }
  }

  getObjects(client: Socket) {
    const packet = new S_BASE_ADD_OBJECT();
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

  setTransform(
    roomId: string,
    objectId: number,
    position: Position,
    rotation: Rotation,
  ) {
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

    gameObject.setPosition(position);
    gameObject.setRotation(rotation);

    // 클라이언트에 변경 사항 전송 등의 추가 작업
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
      return;
    }

    const gameObject = roomGameObjects.get(objectId);

    if (!gameObject) {
      // 오브젝트 없음.
      return;
    }

    gameObject.setAnimations(animationId, animationValue);

    const packet = new S_BASE_SET_ANIMATION();
    packet.objectId = objectId;
    packet.animationId = animationId;
    packet.animation = animationValue;

    const { event, ...packetData } = packet;

    this.logger.debug(`setAnimation Broadcast : ${event} - ${packetData}`);
  }

  setAnimationOnce(
    roomId: string,
    objectId: number,
    animationId: string,
    animationValue: string,
    isLoop: boolean,
    blend: number,
  ) {
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

    const packet = new S_BASE_SET_ANIMATION_ONCE();
    packet.objectId = objectId;
    packet.animationId = animationId;
    packet.isLoop = isLoop;
    packet.blend = blend;

    const { event, ...packetData } = packet;

    this.logger.debug(`setAnimationOnce Broadcast : ${event} - ${packetData}`);
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
}

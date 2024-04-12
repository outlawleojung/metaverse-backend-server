import { S_BASE_SET_TRANSFORM } from './../packets/packet';
import {
  CHAT_SOCKET_C_MESSAGE,
  CHAT_SOCKET_S_MESSAGE,
  COMMON_SOCKET_S_MESSAGE,
  MY_ROOM_SOCKET_C_MESSAGE,
  MY_ROOM_SOCKET_S_MESSAGE,
  PLAYER_SOCKET_C_MESSAGE,
  PLAYER_SOCKET_S_MESSAGE,
} from '@libs/constants';
import { Injectable, Logger } from '@nestjs/common';
import { PlayerService } from '../player/player.service';
import { MyRoomService } from '../my-room/my-room.service';
import { ChatService } from '../chat/chat.service';
import { CommonService } from '../common/common.service';

@Injectable()
export class SubscribeService {
  private readonly logger = new Logger(SubscribeService.name);

  constructor(
    private readonly playerService: PlayerService,
    private readonly myroomService: MyRoomService,
    private readonly chatService: ChatService,
    private readonly commonService: CommonService,
  ) {}

  async roomSubscribePlayerCallbackmessage(message) {
    const data = JSON.parse(message);

    switch (data.packet.eventName) {
      case PLAYER_SOCKET_S_MESSAGE.S_BASE_SET_TRANSFORM:
        await this.playerService.setTransform(data);
        break;
      case PLAYER_SOCKET_S_MESSAGE.S_BASE_SET_ANIMATION:
        await this.playerService.setAnimation(data);
        break;
      case PLAYER_SOCKET_S_MESSAGE.S_BASE_SET_ANIMATION_ONCE:
        await this.playerService.setAnimationOnce(data);
        break;
      // -- 브로드캐스팅을 위한 호출 --
      case PLAYER_SOCKET_S_MESSAGE.S_BASE_ADD_OBJECT:
        await this.playerService.instantiateObject(data);
        break;
      // -- 브로드캐스팅을 위한 호출 --
      case PLAYER_SOCKET_S_MESSAGE.S_INTERACTION_SET_ITEM_NOTICE:
        await this.playerService.setInteraction(data);
        break;
      // -- 브로드캐스팅을 위한 호출 --
      case PLAYER_SOCKET_S_MESSAGE.S_INTERACTION_REMOVE_ITEM_NOTICE:
        await this.playerService.removeInteraction(data);
        break;
      case PLAYER_SOCKET_C_MESSAGE.C_BASE_REMOVE_OBJECT:
        await this.playerService.removeGameObject(data);
        break;
      case PLAYER_SOCKET_S_MESSAGE.S_LEAVE:
        await this.playerService.exitRoom(data);
        break;
      case PLAYER_SOCKET_S_MESSAGE.S_ADD_CLIENT:
        await this.playerService.addClient(data);
        break;
      default:
        this.logger.debug('잘못된 동기화룸 패킷 입니다.');
        console.log(data.packet);
        break;
    }
  }

  async roomSubscribeMyRoomCallbackmessage(message) {
    this.logger.debug('마이룸 구독 콜백 ✅');
    const data = JSON.parse(message);
    console.log(data);

    switch (data.packet.eventName) {
      case MY_ROOM_SOCKET_C_MESSAGE.C_MYROOM_START_EDIT:
        await this.myroomService.broadcastStartEdit(data);
        break;
      case MY_ROOM_SOCKET_C_MESSAGE.C_MYROOM_END_EDIT:
        await this.myroomService.broadcastEndEdit(data);
        break;
      case MY_ROOM_SOCKET_C_MESSAGE.C_MYROOM_KICK:
        await this.myroomService.broadcastKick(data);
        break;
      default:
        this.logger.debug('잘못된 마이룸 패킷 입니다.');
        break;
    }
  }

  async roomSubscribeChatCallbackmessage(message) {
    this.logger.debug('채팅 룸 구독 콜백 ✅');
    const data = JSON.parse(message);
    console.log(data);

    switch (data.packet.eventName) {
      case CHAT_SOCKET_S_MESSAGE.S_SEND_MESSAGE:
        await this.chatService.broadcastMessage(data);
        break;
      case CHAT_SOCKET_C_MESSAGE.C_SEND_DIRECT_MESSAGE:
        break;
      case CHAT_SOCKET_C_MESSAGE.C_SEND_FRIEND_DIRECT_MESSAGE:
        break;
      default:
        this.logger.debug('잘못된 채팅 패킷 입니다.');
        break;
    }
  }

  async roomSubscribeCommonCallbackmessage(message) {
    this.logger.debug('공용 룸 구독 콜백 ✅');
    const data = JSON.parse(message);
    console.log(data);

    switch (data.packet.eventName) {
      case COMMON_SOCKET_S_MESSAGE.S_BASE_SET_OBJECT_DATA_NOTICE:
        await this.commonService.broadcastSetObjectData(data);
        break;
      case MY_ROOM_SOCKET_S_MESSAGE.S_MYROOM_GET_ROOMINFO:
        await this.commonService.broadcastMyRoomGetRoomInfo(data);
        break;
      default:
        this.logger.debug('잘못된 공용 패킷 입니다.');
        break;
    }
  }
}

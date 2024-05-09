import { Injectable, Logger } from '@nestjs/common';
import { GameRoom } from './rooms/game-room';
import { MyRoom } from './rooms/my-room';
import { IRoom } from './room';
import { RoomType } from './room-type';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { MY_ROOM_STATE_TYPE } from '@libs/constants';
import { CreateRoomRequestDto } from './dto/create-room-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Member, MemberAvatarInfo } from '@libs/entity';
import { Repository } from 'typeorm';
import { MyRoomService } from '../my-room/my-room.service';
import { JumpingMatchingRoom } from './rooms/jumping-matching-room';

interface OwnerData {
  ownerNickname: string;
  ownerAvatarInfo: object;
  isShutdown: boolean;
}
@Injectable()
export class RoomFactory {
  constructor(
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
    @InjectRepository(MemberAvatarInfo)
    private memberAvatarInfoRepository: Repository<MemberAvatarInfo>,
    @InjectRedis() private readonly redisClient: Redis,
    private myRoomService: MyRoomService,
  ) {}

  private readonly logger = new Logger(RoomFactory.name);

  async createRoom(roomId: string, data: CreateRoomRequestDto): Promise<IRoom> {
    this.logger.debug('CREATE ROOM');
    switch (data.roomType) {
      case RoomType.Game:
      case RoomType.Arz:
      case RoomType.Conference:
      case RoomType.Vote:
      case RoomType.Store:
      case RoomType.Busan:
      case RoomType.Festival:
        return new GameRoom({
          type: data.roomType,
          roomId,
          sceneName: data.sceneName,
        });
      case RoomType.MyRoom: {
        const ownerData: OwnerData = await this.getOwnerInfo(data.ownerId);

        return new MyRoom({
          roomId,
          sceneName: data.sceneName,
          ownerId: data.ownerId,
          ownerNickname: ownerData.ownerNickname,
          ownerAvatarInfo: ownerData.ownerAvatarInfo,
          isShutdown: ownerData.isShutdown,
        });
      }
      case RoomType.JumpingMatching: {
        return new JumpingMatchingRoom({
          roomId,

          roomName: data.roomName,
          ownerId: data.ownerId,

          maxPlayerNumber: data.maxPlayerNumber,
        });
      }
      case RoomType.OXQuiz:
        break;
      case RoomType.Meeting:
      // return new MeetingRoom({
      //   roomId,
      //   sceneName: data.sceneName,
      //   roomName: data.roomName,
      //   roomCode: data.roomCode,
      //   creatorId: data.creatorId,
      //   description: data.description,
      //   spaceInfoId: data.spaceInfoId,
      //   topicType: data.topicType,
      //   thumbnail: data.thumbnail,
      //   currentHostId: data.currentHostId,
      //   password: data.password,
      //   isAdvertising: data.isAdvertising,
      //   isShutdown: data.isShutdown,
      //   isWaitingRoom: data.isWaitingRoom,
      //   runningTime: data.runningTime,
      //   personnel: data.personnel,
      // });
      default:
        throw new Error('Invalid room type');
    }
  }

  async getOwnerInfo(ownerId: string) {
    try {
      const member = await this.memberRepository.findOne({
        select: ['nickname', 'id', 'myRoomStateType'],
        where: {
          memberCode: ownerId,
        },
      });

      const memberAvatarInfos = await this.memberAvatarInfoRepository.find({
        select: ['avatarPartsType', 'itemId'],
        where: {
          memberId: member.id,
        },
      });

      const ownerAvatarInfo = {};

      for (const m of memberAvatarInfos) {
        ownerAvatarInfo[m.avatarPartsType] = m.itemId;
      }

      const data: OwnerData = {
        ownerNickname: member.nickname,
        ownerAvatarInfo,
        isShutdown:
          member.myRoomStateType === MY_ROOM_STATE_TYPE.NOBODY ? true : false,
      };

      return data;
    } catch (error) {
      console.log('error: ', error);
    }
  }
}

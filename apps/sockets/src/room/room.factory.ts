import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { GameRoom } from './rooms/game-room';
import { MyRoom } from './rooms/my-room';
import { IRoom } from './room';
import { RoomType } from './room-type';
import { RoomService } from './room.service';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { RedisKey } from '@libs/constants';
import { OfficeRoom } from './rooms/office-room';
import { CreateRoomRequestDto } from './dto/create-room-request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Member, MemberAvatarInfo } from '@libs/entity';
import { Repository } from 'typeorm';

interface OwnerData {
  ownerNickname: string;
  ownerAvatarInfo: object;
}
@Injectable()
export class RoomFactory {
  constructor(
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
    @InjectRepository(MemberAvatarInfo)
    private memberAvatarInfoRepository: Repository<MemberAvatarInfo>,
    @InjectRedis() private readonly redisClient: Redis,
  ) {}

  async createRoom(roomId: string, data: CreateRoomRequestDto): Promise<IRoom> {
    switch (data.roomType) {
      case RoomType.Game:
        return new GameRoom({
          roomId,
          roomName: data.roomName,
          ownerId: data.ownerId,
          sceneName: data.sceneName,
        });
      case RoomType.MyRoom:
        // 중복 검증
        const exMyRoom = await this.redisClient.get(
          RedisKey.getStrMyRoom(data.ownerId),
        );
        if (exMyRoom) {
          return JSON.parse(exMyRoom) as MyRoom;
        }
        const onwerData: OwnerData = await this.getOwnerInfo(data.ownerId);

        return new MyRoom({
          roomId,
          sceneName: data.sceneName,
          ownerId: data.ownerId,
          ownerNickname: onwerData.ownerNickname,
          ownerAvatarInfo: onwerData.ownerAvatarInfo,
        });
      case RoomType.Office:
        return new OfficeRoom({
          roomId,
          sceneName: data.sceneName,
          ownerId: data.ownerId,
          roomCode: data.roomCode,
        });
      default:
        throw new Error('Invalid room type');
    }
  }

  async getOwnerInfo(ownerId: string) {
    try {
      const member = await this.memberRepository.findOne({
        select: ['nickname', 'memberId'],
        where: {
          memberCode: ownerId,
        },
      });

      const memberAvatarInfos = await this.memberAvatarInfoRepository.find({
        select: ['avatarPartsType', 'itemId'],
        where: {
          memberId: member.memberId,
        },
      });

      const ownerAvatarInfo = {};

      for (const m of memberAvatarInfos) {
        ownerAvatarInfo[m.avatarPartsType] = m.itemId;
      }

      const data: OwnerData = {
        ownerNickname: member.nickname,
        ownerAvatarInfo,
      };

      return data;
    } catch (error) {
      console.log('error: ', error);
    }
  }
}

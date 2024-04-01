import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { CommonService } from '@libs/common';
import { Member, MemberFriend } from '@libs/entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Redis } from 'ioredis';
import { Server, Socket } from 'socket.io';
import { TokenCheckService } from '../unification/auth/tocket-check.service';
import { Repository } from 'typeorm';
import {
  FRIEND_SOCKET_C_MESSAGE,
  FRIEND_SOCKET_S_MESSAGE,
  RedisKey,
  SOCKET_SERVER_ERROR_CODE_GLOBAL,
} from '@libs/constants';
import { RequestPayload } from '../packets/packet-interface';

@Injectable()
export class FriendService {
  private readonly logger = new Logger(FriendService.name);
  constructor(
    @InjectRedis() private readonly redisClient: Redis,
    private readonly tokenCheckService: TokenCheckService,
    private readonly commonService: CommonService,
    @InjectRepository(Member) private memberRepository: Repository<Member>,
    @InjectRepository(MemberFriend)
    private memberFriendRepository: Repository<MemberFriend>,
  ) {}

  async handleRequestMessage(client: Socket, payload: RequestPayload) {
    switch (payload.event) {
      case FRIEND_SOCKET_C_MESSAGE.C_FRIEND_LIST:
        await this.getFriends(client);
        break;
      case FRIEND_SOCKET_C_MESSAGE.C_FRIEND_FOLLOW:
        await this.friendsFollow(client, payload.data);
        break;
      case FRIEND_SOCKET_C_MESSAGE.C_FRIEND_BRING:
        await this.friendsBring(client, payload.data);
        break;
      default:
        break;
    }
  }
  // // 소켓 연결
  // async handleConnection(
  //   server: Server,
  //   client: Socket,
  //   jwtAccessToken: string,
  //   sessionId: string,
  // ) {
  //   const memberInfo =
  //     await this.tokenCheckService.checkLoginToken(jwtAccessToken);

  //   // 해당 멤버가 존재하지 않을 경우 연결 종료
  //   if (!memberInfo) {
  //     client.disconnect();
  //     return;
  //   }

  //   const memberId = memberInfo.memberId;

  //   client.join(memberId);
  //   client.join(client.handshake.auth.sessionId);

  //   // 클라이언트 데이터 설정
  //   client.data.memberId = memberId;
  //   client.data.sessionId = client.handshake.auth.sessionId;
  //   client.data.jwtAccessToken = client.handshake.auth.jwtAccessToken;
  //   client.data.clientId = client.id;

  //   this.logger.debug(
  //     `친구 서버에 연결되었어요 ✅ : ${memberId} - sessionId : ${sessionId}`,
  //   );
  // }

  async getFriends(client: Socket) {
    const memberId = client.data.memberId;
    try {
      const friends = await this.memberFriendRepository
        .createQueryBuilder('mf')
        .select([
          'm.memberId as friendMemberId',
          'm.memberCode as friendMemberCode',
          'm.nickname as friendNickname',
          'm.stateMessage as friendMessage',
          'mf.createdAt as createdAt',
          'mf.bookmark as bookmark',
          'mf.bookmarkedAt as bookmarkedAt',
        ])
        .innerJoin('member', 'm', 'm.memberId = mf.friendMemberId')
        .where('mf.memberId = :memberId', { memberId })
        .getRawMany();

      for (const f of friends) {
        const avatarInfos = await this.commonService.getMemberAvatarInfo(
          f.friendMemberCode,
        );
        f.avatarInfos = avatarInfos;

        // 온라인 여부
        if (
          await this.redisClient.exists(
            RedisKey.getStrMemberSocket(f.friendMemberId),
          )
        ) {
          console.log(f.friendMemberId);
          f.isOnline = true;
        } else {
          f.isOnline = false;
        }
      }

      return client.emit(
        FRIEND_SOCKET_S_MESSAGE.S_FRIEND_LIST,
        JSON.stringify(friends),
      );
    } catch (err) {
      console.log(err);
    }
  }

  async friendsFollow(client: Socket, data: { friendMemberId: any }) {
    // memberId가 존재하는지 확인
    const memberInfo = await this.memberRepository.findOne({
      where: {
        memberId: data.friendMemberId,
      },
    });

    //유저가 존재하지 않을 경우
    if (!memberInfo) {
      return client.emit(
        FRIEND_SOCKET_S_MESSAGE.S_FRIEND_FOLLOW,
        JSON.stringify({
          code: SOCKET_SERVER_ERROR_CODE_GLOBAL.FRIEND_NOT_EXIST,
        }),
      );
    }

    // 이미 친구인지 확인
    const memberFriendInfo = await this.memberFriendRepository.findOne({
      where: {
        memberId: client.data.memberId,
        friendMemberId: data.friendMemberId,
      },
    });

    // 친구가 아닐 경우
    if (!memberFriendInfo) {
      return client.emit(
        FRIEND_SOCKET_S_MESSAGE.S_FRIEND_FOLLOW,
        JSON.stringify({
          code: SOCKET_SERVER_ERROR_CODE_GLOBAL.FRIEND_NOT_FRIEND,
        }),
      );
    }

    //소켓 가져오기
    const socketInfo = await this.redisClient.get(
      RedisKey.getStrMemberSocket(data.friendMemberId),
    );

    //존재 하지 않을 경우 오프라인
    if (!socketInfo) {
      return client.emit(
        FRIEND_SOCKET_S_MESSAGE.S_FRIEND_FOLLOW,
        JSON.stringify({
          code: SOCKET_SERVER_ERROR_CODE_GLOBAL.FRIEND_IS_OFFLINE,
        }),
      );
    } else {
      // 입장할 수 없을 경우
      const failMemberInfo = {
        code: 40012,
        roomId: JSON.parse(socketInfo).roomId,
        sceneName: JSON.parse(socketInfo).sceneName,
        memberCode: memberInfo.memberCode,
        nickName: memberInfo.nickname,
        myRoomStateType: memberInfo.myRoomStateType,
      };

      // 입장할 수 없는 씬일 경우
      if (
        JSON.parse(socketInfo).sceneName === 'Scene_Room_JumpingMatching' &&
        JSON.parse(socketInfo).sceneName === 'Scene_Room_OXQuiz' &&
        JSON.parse(socketInfo).sceneName === 'Scene_Room_Lecture' &&
        JSON.parse(socketInfo).sceneName === 'Scene_Room_Lecture_22Christmas' &&
        JSON.parse(socketInfo).sceneName === 'Scene_Room_Meeting' &&
        JSON.parse(socketInfo).sceneName === 'Scene_Room_Meeting_22Christmas' &&
        JSON.parse(socketInfo).sceneName === 'Scene_Room_Meeting_Office' &&
        JSON.parse(socketInfo).sceneName === 'Scene_Room_Consulting'
      ) {
        return client.emit(
          FRIEND_SOCKET_S_MESSAGE.S_FRIEND_FOLLOW,
          JSON.stringify(failMemberInfo),
        );
      }

      // 마이룸일 경우 권한 검사
      if (JSON.parse(socketInfo).sceneName === 'Scene_Room_MyRoom') {
        if (memberInfo.myRoomStateType === 4) {
          return client.emit(
            FRIEND_SOCKET_S_MESSAGE.S_FRIEND_FOLLOW,
            JSON.stringify(failMemberInfo),
          );
        }
      }

      // 입장이 가능한 경우
      const friendMemberInfo = {
        code: SOCKET_SERVER_ERROR_CODE_GLOBAL.FRIEND_FOLLOW,
        roomId: JSON.parse(socketInfo).roomId,
        sceneName: JSON.parse(socketInfo).sceneName,
        memberCode: memberInfo.memberCode,
        nickName: memberInfo.nickname,
        myRoomStateType: memberInfo.myRoomStateType,
      };

      return client.emit(
        FRIEND_SOCKET_S_MESSAGE.S_FRIEND_FOLLOW,
        JSON.stringify(friendMemberInfo),
      );
    }
  }

  async friendsBring(client: Socket, friendMemberId: string) {
    // memberId가 존재하는지 확인
    const friendMemberInfo = await this.memberRepository.findOne({
      where: {
        memberId: friendMemberId,
      },
    });

    const memberInfo = await this.memberRepository.findOne({
      where: {
        memberId: client.data.memberId,
      },
    });

    //유저가 존재하지 않을 경우
    if (!friendMemberInfo) {
      return client.emit(
        FRIEND_SOCKET_S_MESSAGE.S_FRIEND_BRING,
        JSON.stringify({
          code: SOCKET_SERVER_ERROR_CODE_GLOBAL.FRIEND_NOT_EXIST,
        }),
      );
    }

    // 이미 친구인지 확인
    const memberFriendInfo = await this.memberFriendRepository.findOne({
      where: {
        memberId: client.data.memberId,
        friendMemberId: friendMemberId,
      },
    });

    // 친구가 아닐 경우
    if (!memberFriendInfo) {
      return client.emit(
        FRIEND_SOCKET_S_MESSAGE.S_FRIEND_BRING,
        JSON.stringify({
          code: SOCKET_SERVER_ERROR_CODE_GLOBAL.FRIEND_NOT_FRIEND,
        }),
      );
    }

    //소켓 가져오기
    const friendSocketInfo = await this.redisClient.get(
      RedisKey.getStrMemberSocket(friendMemberId),
    );

    //자신의 소켓 가져오기
    const socketInfo = await this.redisClient.get(
      RedisKey.getStrMemberSocket(client.data.memberId),
    );
    //존재 하지 않을 경우 오프라인
    if (!friendSocketInfo) {
      return client.emit(
        FRIEND_SOCKET_S_MESSAGE.S_FRIEND_BRING,
        JSON.stringify({
          code: SOCKET_SERVER_ERROR_CODE_GLOBAL.FRIEND_IS_OFFLINE,
        }),
      );
    } else {
      // 입장할 수 없을 경우
      const failMemberInfo = {
        code: 40012,
        roomId: JSON.parse(socketInfo).roomId,
        sceneName: JSON.parse(socketInfo).sceneName,
        memberCode: memberInfo.memberCode,
        nickName: memberInfo.nickname,
        myRoomStateType: memberInfo.myRoomStateType,
      };

      // 입장할 수 없는 씬일 경우
      if (
        JSON.parse(socketInfo).sceneName === 'Scene_Room_JumpingMatching' &&
        JSON.parse(socketInfo).sceneName === 'Scene_Room_OXQuiz' &&
        JSON.parse(socketInfo).sceneName === 'Scene_Room_Lecture' &&
        JSON.parse(socketInfo).sceneName === 'Scene_Room_Lecture_22Christmas' &&
        JSON.parse(socketInfo).sceneName === 'Scene_Room_Meeting' &&
        JSON.parse(socketInfo).sceneName === 'Scene_Room_Meeting_22Christmas' &&
        JSON.parse(socketInfo).sceneName === 'Scene_Room_Meeting_Office' &&
        JSON.parse(socketInfo).sceneName === 'Scene_Room_Consulting'
      ) {
        return client.emit(
          FRIEND_SOCKET_S_MESSAGE.S_FRIEND_FOLLOW,
          JSON.stringify(failMemberInfo),
        );
      }

      // 마이룸일 경우 권한 검사
      if (JSON.parse(socketInfo).sceneName === 'Scene_Room_MyRoom') {
        if (memberInfo.myRoomStateType === 4) {
          return client.emit(
            FRIEND_SOCKET_S_MESSAGE.S_FRIEND_FOLLOW,
            JSON.stringify(failMemberInfo),
          );
        }
      }

      const friendMemberInfo = {
        code: SOCKET_SERVER_ERROR_CODE_GLOBAL.FRIEND_BRING,
        roomId: JSON.parse(socketInfo).roomId,
        sceneName: JSON.parse(socketInfo).sceneName,
        memberCode: memberInfo.memberCode,
        nickName: memberInfo.nickname,
        myRoomStateType: memberInfo.myRoomStateType,
      };

      return client
        .to(friendMemberId)
        .emit(
          FRIEND_SOCKET_S_MESSAGE.S_FRIEND_BRING,
          JSON.stringify(friendMemberInfo),
        );
    }
  }
}

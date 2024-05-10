import {
  FunctionTableRepository,
  MemberBlock,
  MemberBlockRepository,
  MemberConnectInfoRepository,
  MemberFriend,
  MemberFriendRepository,
  MemberFriendRequestRepository,
  MemberRepository,
} from '@libs/entity';
import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import { ERRORCODE, ERROR_MESSAGE, FUNCTION_TABLE } from '@libs/constants';
import { CommonFriendDto } from './dto/request/common.friend.dto';
import { FindFriendDto } from './dto/request/find.friend.dto';

@Injectable()
export class FriendService {
  private readonly logger = new Logger(FriendService.name);
  constructor(
    private memberRepository: MemberRepository,
    private memberFriendRepository: MemberFriendRepository,
    private memberFriendRequestRepository: MemberFriendRequestRepository,
    private memberBlockRepository: MemberBlockRepository,
    private functionTableRepository: FunctionTableRepository,
    private memberConnectInfoRepository: MemberConnectInfoRepository,
  ) {}

  // async getFriends(memberId: string) {
  //   try {
  //     const friends = await this.memberFriendRepository
  //       .createQueryBuilder('mf')
  //       .select([
  //         'm.memberCode as friendMemberCode',
  //         'm.nickname as friendNickname',
  //         'm.stateMessage as friendMessage',
  //         'mf.createdAt as createdAt',
  //         'mf.bookmark as bookmark',
  //         'mf.bookmarkedAt as bookmarkedAt',
  //       ])
  //       .innerJoin('member', 'm', 'm.id = mf.friendMemberId')
  //       .where('mf.id = :memberId', { memberId })
  //       .getRawMany();

  //     for (const f of friends) {
  //       const avatarInfos = await this.commonService.getMemberAvatarInfo(
  //         f.friendMemberCode,
  //       );
  //       f.avatarInfos = avatarInfos;
  //     }

  //     return {
  //       friends,
  //       error: ERRORCODE.NET_E_SUCCESS,
  //       message: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
  //     };
  //   } catch (err) {
  //     console.log(err);
  //     this.logger.log(err);
  //     throw new HttpException(
  //       {
  //         error: ERRORCODE.NET_E_DB_FAILED,
  //         message: ERROR_MESSAGE(ERRORCODE.NET_E_DB_FAILED),
  //       },
  //       HttpStatus.FORBIDDEN,
  //     );
  //   }
  // }

  // 친구 요청 하기
  async requestFriend(
    memberId: string,
    data: FindFriendDto,
    queryRunner: QueryRunner,
  ): Promise<any> {
    const requestType = data.requestType;
    const friendId = data.friendId;

    // 해당 친구의 존재 여부 확인
    const friend = await this.memberRepository.findByRequestTypeForFriend(
      requestType,
      friendId,
    );

    // 존재하지 않는다.
    if (!friend) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_NOT_EXIST_USER,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_USER),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    // 자기 자신은 친구로 추가 할 수 없음.
    if (friend.id === memberId) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_CANNOT_REQUEST_MYSELF,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_CANNOT_REQUEST_MYSELF),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    // 차단된 회원인지 확인
    const blockmember = await this.memberBlockRepository.exists(
      memberId,
      friend.id,
    );

    if (blockmember) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_MEMBER_IS_BLOCK,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_MEMBER_IS_BLOCK),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    // 이미 친구 인지 확인
    const myFriend = await this.memberFriendRepository.exists(
      memberId,
      friend.id,
    );

    // 이미 친구 이다.
    if (myFriend) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_ALREADY_FRIEND,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_ALREADY_FRIEND),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    // 이미 친구 요청을 보냈는지 확인
    const myRequest = await this.memberFriendRequestRepository.exists(
      memberId,
      friend.id,
    );

    // 이미 요청을 보낸 사용자
    if (myRequest) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_ALREADY_SEND_FRIEND_REQUEST,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_ALREADY_SEND_FRIEND_REQUEST),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    // 이미 나에게 요청을 보낸 사용자인지 확인
    const requstMe = await this.memberFriendRequestRepository.exists(
      friend.id,
      memberId,
    );

    // 이미 나에게 요청을 보낸 사용자
    if (requstMe) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_ALREADY_RECEIVED_FRIEND_REQUEST,
          message: ERROR_MESSAGE(
            ERRORCODE.NET_E_ALREADY_RECEIVED_FRIEND_REQUEST,
          ),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const maxCount = await this.functionTableRepository.findById(
      FUNCTION_TABLE.RECEIVE_FRIEND_COUNT,
    );

    await this.memberFriendRequestRepository.managerFriendRequest(
      memberId,
      friend.id,
      maxCount.value,
      queryRunner,
    );

    return {
      error: ERRORCODE.NET_E_SUCCESS,
      message: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
    };
  }

  // 친구 요청 목록 조회
  async getRequestFriends(memberId: string) {
    try {
      const friends =
        await this.memberFriendRequestRepository.findByReceivedMemberId(
          memberId,
        );

      return {
        myRequestList: friends,
        error: ERRORCODE.NET_E_SUCCESS,
        message: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
      };
    } catch (err) {
      console.log(err.toString);
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_DB_FAILED,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_DB_FAILED),
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  // 친구 요청 받은 목록 조회
  async receiveRequestFriends(memberId: string) {
    try {
      const friends =
        await this.memberFriendRequestRepository.findByRequestMemberId(
          memberId,
        );

      return {
        myReceivedList: friends,
        error: ERRORCODE.NET_E_SUCCESS,
        message: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
      };
    } catch (err) {
      this.logger.error({ err });
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_DB_FAILED,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_DB_FAILED),
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  // 친구 수락 하기
  async acceptFriend(
    memberId: string,
    friendMemeberCode: string,
    queryRunner: QueryRunner,
  ) {
    const exFriend =
      await this.memberRepository.findByMemberCode(friendMemeberCode);

    if (!exFriend) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_NOT_EXIST_USER,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_USER),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    // 친구 요청을 받았는지 확인
    const friendRequest = await this.memberFriendRequestRepository.exists(
      exFriend.id,
      memberId,
    );
    if (!friendRequest) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_NOT_EXIST_RECEIVED_REQUEST,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_RECEIVED_REQUEST),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    // 친구 여부 확인
    const friend =
      await this.memberFriendRepository.findByMemberIdAndFriendMemberId(
        memberId,
        exFriend.id,
      );
    if (friend) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_ALREADY_FRIEND,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_ALREADY_FRIEND),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    // 최대 가능한 친구 수
    const maxCount = await this.functionTableRepository.findById(
      FUNCTION_TABLE.MAX_FRIEND_COUNT,
    );

    // 내 친구 수 확인
    const myFrinedCount = await this.memberFriendRepository.count(memberId);

    // 내 친구 수 초과 시
    if (myFrinedCount >= maxCount.value) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_MY_FRIEND_MAX_COUNT,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_MY_FRIEND_MAX_COUNT),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    // 상대 친구 수 확인
    const targetFrinedCount = await this.memberFriendRepository.count(
      exFriend.id,
    );

    // 상대의 친구 수 초과 시
    if (targetFrinedCount >= maxCount.value) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_TARGET_FRIEND_MAX_COUNT,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_TARGET_FRIEND_MAX_COUNT),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const memberFriendMe = new MemberFriend();
    memberFriendMe.memberId = memberId;
    memberFriendMe.friendMemberId = exFriend.id;

    await this.memberFriendRepository.create(memberFriendMe, queryRunner);

    const memberFriendYou = new MemberFriend();
    memberFriendYou.memberId = exFriend.id;
    memberFriendYou.friendMemberId = memberId;

    await this.memberFriendRepository.create(memberFriendYou, queryRunner);

    await this.memberFriendRequestRepository.delete(
      exFriend.id,
      memberId,
      queryRunner,
    );
    return {
      error: ERRORCODE.NET_E_SUCCESS,
      message: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
    };
  }

  // 친구 요청 취소 하기
  async cancelRequestFriend(
    memberId: string,
    friendMemeberCode: string,
    queryRunner: QueryRunner,
  ) {
    // 요청 받은 친구 확인
    const exFriend =
      await this.memberRepository.findByMemberCode(friendMemeberCode);

    // 존재하지 않는다.
    if (!exFriend) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_NOT_EXIST_USER,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_USER),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const result = await this.memberFriendRequestRepository.delete(
      memberId,
      exFriend.id,
      queryRunner,
    );

    if (result.affected === 0) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_NOT_EXIST_REQUEST,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_REQUEST),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    return {
      error: ERRORCODE.NET_E_SUCCESS,
      message: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
    };
  }

  // 받은 친구 요청 거절 하기
  async refusalRequestFriend(
    memberId: string,
    friendMemeberCode: string,
    queryRunner: QueryRunner,
  ) {
    // 요청한 친구 확인

    const exFriend =
      await this.memberRepository.findByMemberCode(friendMemeberCode);

    // 존재하지 않는다.
    if (!exFriend) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_NOT_EXIST_USER,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_USER),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const result = await this.memberFriendRequestRepository.delete(
      exFriend.id,
      memberId,
      queryRunner,
    );

    if (result.affected === 0) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_NOT_EXIST_RECEIVED_REQUEST,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_RECEIVED_REQUEST),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    return {
      error: ERRORCODE.NET_E_SUCCESS,
      message: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
    };
  }

  // 친구 차단 하기
  async blockFriend(
    memberId: string,
    data: CommonFriendDto,
    queryRunner: QueryRunner,
  ) {
    // 차단할 친구 확인
    const exFrnd = await this.memberRepository.findByMemberCode(
      data.friendMemeberCode,
    );

    // 존재하지 않는다.
    if (!exFrnd) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_NOT_EXIST_USER,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_USER),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    // 차단 여부 확인
    const preBlock = await this.memberBlockRepository.exists(
      memberId,
      exFrnd.id,
    );

    // 이미 차단 됨.
    if (preBlock) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_MEMBER_IS_BLOCK,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_MEMBER_IS_BLOCK),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    // 친구 상태 해제
    await this.memberFriendRepository.delete(memberId, exFrnd.id, queryRunner);

    await this.memberFriendRepository.delete(exFrnd.id, memberId, queryRunner);

    // 차단 목록에 등록
    const memberBlock = new MemberBlock();
    memberBlock.memberId = memberId;
    memberBlock.blockMemberId = exFrnd.id;

    await this.memberBlockRepository.create(memberBlock, queryRunner);

    return {
      error: ERRORCODE.NET_E_SUCCESS,
      message: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
    };
  }

  // 친구 삭제
  async deleteFriend(
    memberId: string,
    friendMemeberCode: string,
    queryRunner: QueryRunner,
  ) {
    // 요청한 친구 확인
    const exFrnd =
      await this.memberRepository.findByMemberCode(friendMemeberCode);

    // 존재하지 않는다.
    if (!exFrnd) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_NOT_EXIST_USER,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_USER),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    // 친구 여부 확인 하기
    const memberFriend =
      await this.memberFriendRepository.findByMemberIdAndFriendMemberId(
        memberId,
        exFrnd.id,
      );

    if (!memberFriend) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_ALREADY_FRIEND,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_ALREADY_FRIEND),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    await this.memberFriendRepository.delete(memberId, exFrnd.id, queryRunner);

    await this.memberFriendRepository.delete(exFrnd.id, memberId, queryRunner);

    return {
      error: ERRORCODE.NET_E_SUCCESS,
      message: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
    };
  }

  // 친구 차단 해제 하기
  async releaseBlockFriend(
    memberId: string,
    friendMemeberCode: string,
    queryRunner: QueryRunner,
  ) {
    // 차단 친구 확인
    const exFrnd =
      await this.memberRepository.findByMemberCode(friendMemeberCode);

    // 존재하지 않는다.
    if (!exFrnd) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_NOT_EXIST_USER,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_USER),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const blockMember = await this.memberBlockRepository.exists(
      memberId,
      exFrnd.id,
    );

    // 차단 목록에 없다.
    if (!blockMember) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_NOT_EXIST_USER,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_USER),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    await this.memberBlockRepository.delete(memberId, exFrnd.id, queryRunner);

    return {
      error: ERRORCODE.NET_E_SUCCESS,
      message: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
    };
  }

  // 친구 차단 목록 조회
  async getBlockFriends(memberId: string) {
    const blockMembers =
      await this.memberBlockRepository.findByMemberIdForBlockMemberInfo(
        memberId,
      );

    return {
      blockMembers,
      error: ERRORCODE.NET_E_SUCCESS,
      message: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
    };
  }

  // 친구 조회
  async findFriend(requestType: number, friendId: string) {
    // 해당 친구의 존재 여부 확인
    const friend = await this.memberRepository.findByRequestTypeForFriend(
      requestType,
      friendId,
    );

    // 존재하지 않는다.
    if (!friend) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_NOT_EXIST_USER,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_USER),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const member =
      await this.memberRepository.findByMemberIdForMemberInfoAndAvatar(
        friend.id,
      );

    return {
      member,
      error: ERRORCODE.NET_E_SUCCESS,
      message: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
    };
  }

  // 친구 즐겨찾기
  async bookmark(
    memberId: string,
    data: CommonFriendDto,
    queryRunner: QueryRunner,
  ) {
    // 즐겨찾기 친구 확인
    const exfriend = await this.memberRepository.findByMemberCode(
      data.friendMemeberCode,
    );

    // 존재하지 않는다.
    if (!exfriend) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_NOT_EXIST_USER,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_USER),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const memberFriend = await this.memberFriendRepository.toggleBookmark(
      memberId,
      exfriend.id,
      queryRunner,
    );

    return {
      friendMemberCode: exfriend.memberCode,
      bookmark: memberFriend.bookmark,
      bookmarkedAt: memberFriend.bookmarkedAt,
      error: ERRORCODE.NET_E_SUCCESS,
      message: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
    };
  }

  async findRoomId(friendMemberCode: string) {
    try {
      const roomId =
        this.memberConnectInfoRepository.findByMemberCode(friendMemberCode);

      if (!roomId)
        return {
          roomId: null,
          error: ERRORCODE.NET_E_SUCCESS,
          errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
        };
      return {
        roomId,
        error: ERRORCODE.NET_E_SUCCESS,
        errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
      };
    } catch (error) {
      this.logger.error({ error });
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_DB_FAILED,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_DB_FAILED),
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }
}

import {
  BlockMember,
  FriendRequest,
  FunctionTable,
  Member,
  MemberConnectInfo,
  MemberFriend,
} from '@libs/entity';
import {
  Inject,
  Injectable,
  HttpException,
  HttpStatus,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Not, In, Repository } from 'typeorm';
import { GetCommonDto } from '../dto/get.common.dto';
import { CommonService } from '@libs/common';
import {
  ERRORCODE,
  ERROR_MESSAGE,
  FRND_REQUEST_TYPE,
  FUNCTION_TABLE,
} from '@libs/constants';
import { CommonFriendDto } from './dto/request/common.friend.dto';
import { FindFriendDto } from './dto/request/find.friend.dto';

@Injectable()
export class FriendService {
  private readonly logger = new Logger(FriendService.name);
  constructor(
    @InjectRepository(Member) private memberRepository: Repository<Member>,
    @InjectRepository(MemberFriend)
    private memberFriendRepository: Repository<MemberFriend>,
    @InjectRepository(FriendRequest)
    private friendRequestRepository: Repository<FriendRequest>,
    @InjectRepository(BlockMember)
    private blockMemberRepository: Repository<BlockMember>,
    private readonly commonService: CommonService,
    @Inject(DataSource) private dataSource: DataSource,
  ) {}

  async getFriends(request: GetCommonDto) {
    const memberId = request.memberId;
    try {
      const friends = await this.memberFriendRepository
        .createQueryBuilder('mf')
        .select([
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
      }

      return {
        friends,
        error: ERRORCODE.NET_E_SUCCESS,
        message: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
      };
    } catch (err) {
      console.log(err);
      this.logger.log(err);
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_DB_FAILED,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_DB_FAILED),
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  // 친구 요청 하기
  async requestFriend(data: FindFriendDto): Promise<any> {
    const memberId = data.memberId;
    const requestType = data.requestType;
    const friendId = data.friendId;

    // 해당 친구의 존재 여부 확인
    const member = await this.memberRepository
      .createQueryBuilder('m')
      .select(['m.memberId as memberId']);

    switch (requestType) {
      case FRND_REQUEST_TYPE.MEMBER_CODE:
        member.where('m.memberCode=:memberCode', { memberCode: friendId });
        break;

      case FRND_REQUEST_TYPE.NICKNAME:
        member.where('m.nickname=:nickname', { nickname: friendId });
        break;
      default:
        break;
    }
    const exFrnd = await member.getRawOne();

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

    // 자기 자신은 친구로 추가 할 수 없음.
    if (exFrnd.memberId === data.memberId) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_CANNOT_REQUEST_MYSELF,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_CANNOT_REQUEST_MYSELF),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    // 차단된 회원인지 확인
    const blockmember = await this.blockMemberRepository.findOne({
      where: {
        memberId: memberId,
        blockMemberId: exFrnd.memberId,
      },
    });

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
    const myFrnd = await this.memberFriendRepository.findOne({
      where: {
        memberId: memberId,
        friendMemberId: exFrnd.memberId,
      },
    });

    // 이미 친구 이다.
    if (myFrnd) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_ALREADY_FRIEND,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_ALREADY_FRIEND),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    // 이미 친구 요청을 보냈는지 확인
    const myRequest = await this.friendRequestRepository.findOne({
      where: {
        requestMemberId: memberId,
        receivedMemberId: exFrnd.memberId,
      },
    });

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
    const requstMe = await this.friendRequestRepository.findOne({
      where: {
        requestMemberId: exFrnd.memberId,
        receivedMemberId: memberId,
      },
    });

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

    const reqMaxCount = await this.dataSource
      .getRepository(FunctionTable)
      .findOne({
        where: {
          id: FUNCTION_TABLE.REQUEST_FRIEND_COUNT,
        },
      });

    const rcvMaxCount = await this.dataSource
      .getRepository(FunctionTable)
      .findOne({
        where: {
          id: FUNCTION_TABLE.RECEIVE_FRIEND_COUNT,
        },
      });

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const fr = new FriendRequest();
      fr.requestMemberId = memberId;
      fr.receivedMemberId = exFrnd.memberId;

      await queryRunner.manager.getRepository(FriendRequest).save(fr);

      // 내 요청이 100개 이상이면 오래 된 순으로 삭제 ( 100개 유지 )
      const myRequest = await this.friendRequestRepository
        .createQueryBuilder('f')
        .select(['f.createdAt as createdAt'])
        .where('f.requestMemberId = :memberId', { memberId })
        .limit(reqMaxCount.value)
        .orderBy('f.createdAt', 'DESC')
        .getRawMany();

      console.log(myRequest);
      console.log(myRequest.length);

      if (myRequest.length >= reqMaxCount.value) {
        const deletedAt = myRequest[reqMaxCount.value - 1].createdAt;

        await queryRunner.query(
          `DELETE FROM friendrequest 
        WHERE requestMemberId = ? AND createdAt <= ?`,
          [memberId, deletedAt],
        );
      }

      // 상대의 받은 요청이 100개 이상이면 오래 된 순으로 삭제 ( 100개 유지 )
      const otherReceived = await this.friendRequestRepository
        .createQueryBuilder('f')
        .select(['f.createdAt as createdAt'])
        .where('f.receivedMemberId = :memberId', { memberId: exFrnd.memberId })
        .limit(rcvMaxCount.value)
        .orderBy('f.createdAt', 'DESC')
        .getRawMany();

      if (otherReceived.length >= rcvMaxCount.value) {
        const deletedAt = otherReceived[rcvMaxCount.value - 1].createdAt;

        await queryRunner.query(
          `DELETE FROM friendrequest 
        WHERE receivedMemberId = ? AND createdAt <= ?`,
          [exFrnd.memberId, deletedAt],
        );
      }

      await queryRunner.commitTransaction();

      return {
        error: ERRORCODE.NET_E_SUCCESS,
        message: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.error({ err });
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_DB_FAILED,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_DB_FAILED),
        },
        HttpStatus.FORBIDDEN,
      );
    } finally {
      await queryRunner.release();
    }
  }

  // 친구 요청 목록 조회
  async getRequestFriends(data: GetCommonDto) {
    const rquestMemberId = data.memberId;
    try {
      const friends = await this.friendRequestRepository
        .createQueryBuilder('fq')
        .select([
          'm.memberCode as friendMemberCode',
          'm.nickname as friendNickname',
          'm.stateMessage as friendMessage',
          'fq.createdAt as createdAt',
        ])
        .innerJoin('member', 'm', 'm.memberId = fq.receivedMemberId')
        .where('fq.requestMemberId = :rquestMemberId', { rquestMemberId })
        .getRawMany();

      for (const f of friends) {
        const avatarInfos = await this.commonService.getMemberAvatarInfo(
          f.friendMemberCode,
        );
        f.avatarInfos = avatarInfos;
      }

      return {
        myRequestList: friends,
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

  // 친구 요청 받은 목록 조회
  async receiveRequestFriends(data: GetCommonDto) {
    const receivedMemberId = data.memberId;
    try {
      const friends = await this.dataSource.manager.query(
        `SELECT 
        m.memberCode as friendMemberCode, 
        m.nickname as friendNickname, 
        m.stateMessage as friendMessage,
        fq.createdAt as requestedAt
        FROM friendRequest as fq 
        LEFT JOIN member as m on fq.requestMemberId = m.memberId 
        WHERE
        receivedMemberId = ? and requestMemberId 
        NOT IN (select blockMemberId from blockMember where memberId = ?)`,
        [receivedMemberId, receivedMemberId],
      );

      for (const f of friends) {
        const avatarInfos = await this.commonService.getMemberAvatarInfo(
          f.friendMemberCode,
        );
        f.avatarInfos = avatarInfos;
      }

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
  async acceptFriend(data: GetCommonDto, friendMemeberCode: string) {
    const memberId = data.memberId;

    const exMember = await this.memberRepository.findOne({
      where: {
        memberCode: friendMemeberCode,
      },
    });

    if (!exMember) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_NOT_EXIST_USER,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_USER),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    // 친구 요청을 받았는지 확인
    const friendRequest = await this.friendRequestRepository.findOne({
      where: {
        requestMemberId: exMember.memberId,
        receivedMemberId: memberId,
      },
    });
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
    const friend = await this.memberFriendRepository.findOne({
      where: {
        memberId: memberId,
        friendMemberId: exMember.memberId,
      },
    });
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
    const maxFriendCount = await this.dataSource
      .getRepository(FunctionTable)
      .findOne({
        where: {
          id: FUNCTION_TABLE.MAX_FRIEND_COUNT,
        },
      });

    // 내 친구 수 확인
    const myFrined = await this.memberFriendRepository.count({
      where: {
        memberId: data.memberId,
      },
    });

    // 내 친구 수 초과 시
    if (myFrined >= maxFriendCount.value) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_MY_FRIEND_MAX_COUNT,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_MY_FRIEND_MAX_COUNT),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    // 상대 친구 수 확인
    const targetFrined = await this.memberFriendRepository.count({
      where: {
        memberId: exMember.memberId,
      },
    });

    // 상대의 친구 수 초과 시
    if (targetFrined >= maxFriendCount.value) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_TARGET_FRIEND_MAX_COUNT,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_TARGET_FRIEND_MAX_COUNT),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const memberFriendMe = new MemberFriend();
      memberFriendMe.memberId = memberId;
      memberFriendMe.friendMemberId = exMember.memberId;

      const memberFriendYou = new MemberFriend();
      memberFriendYou.memberId = exMember.memberId;
      memberFriendYou.friendMemberId = memberId;

      await queryRunner.manager
        .getRepository(MemberFriend)
        .save(memberFriendMe);
      await queryRunner.manager
        .getRepository(MemberFriend)
        .save(memberFriendYou);

      await this.friendRequestRepository.delete({
        requestMemberId: exMember.memberId,
        receivedMemberId: memberId,
      });

      await queryRunner.commitTransaction();

      return {
        error: ERRORCODE.NET_E_SUCCESS,
        message: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error({ error });
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_DB_FAILED,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_DB_FAILED),
        },
        HttpStatus.FORBIDDEN,
      );
    } finally {
      await queryRunner.release();
    }
  }

  // 친구 요청 취소 하기
  async cancelRequestFriend(data: GetCommonDto, friendMemeberCode: string) {
    // 요청 받은 친구 확인
    const exFrnd = await this.memberRepository.findOne({
      where: {
        memberCode: friendMemeberCode,
      },
    });

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

    // 나의 요청 확인 하기
    const requestFriend = await this.friendRequestRepository.findOne({
      where: {
        requestMemberId: data.memberId,
        receivedMemberId: exFrnd.memberId,
      },
    });

    if (!requestFriend) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_NOT_EXIST_REQUEST,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_REQUEST),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.delete(FriendRequest, {
        requestMemberId: data.memberId,
        receivedMemberId: exFrnd.memberId,
      });

      await queryRunner.commitTransaction();

      return {
        error: ERRORCODE.NET_E_SUCCESS,
        message: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error({ error });
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_DB_FAILED,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_DB_FAILED),
        },
        HttpStatus.FORBIDDEN,
      );
    } finally {
      await queryRunner.release();
    }
  }

  // 친구 요청 거절 하기
  async refusalRequestFriend(data: GetCommonDto, friendMemeberCode: string) {
    // 요청한 친구 확인
    const exFrnd = await this.memberRepository.findOne({
      where: {
        memberCode: friendMemeberCode,
      },
    });

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

    // 친구 요청 확인 하기
    const requestFriend = await this.friendRequestRepository.findOne({
      where: {
        requestMemberId: exFrnd.memberId,
        receivedMemberId: data.memberId,
      },
    });

    if (!requestFriend) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_NOT_EXIST_REQUEST,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_REQUEST),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.delete(FriendRequest, {
        requestMemberId: exFrnd.memberId,
        receivedMemberId: data.memberId,
      });

      await queryRunner.commitTransaction();

      return {
        error: ERRORCODE.NET_E_SUCCESS,
        message: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error({ error });
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_DB_FAILED,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_DB_FAILED),
        },
        HttpStatus.FORBIDDEN,
      );
    } finally {
      await queryRunner.release();
    }
  }

  // 친구 차단 하기
  async blockFriend(data: CommonFriendDto) {
    // 사용자 존재 여부 확인
    const me = await this.memberRepository.findOne({
      where: { memberId: data.memberId },
    });

    if (me.memberCode === data.friendMemeberCode) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_CANNOT_BLOCK_MYSELF,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_CANNOT_BLOCK_MYSELF),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    // 차단할 친구 확인
    const exFrnd = await this.memberRepository.findOne({
      where: {
        memberCode: data.friendMemeberCode,
      },
    });

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
    const preBlock = await this.blockMemberRepository.findOne({
      where: {
        memberId: data.memberId,
        blockMemberId: exFrnd.memberId,
      },
    });

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

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 친구 상태 해제
      await queryRunner.manager.delete(MemberFriend, {
        memberId: data.memberId,
        friendMemberId: exFrnd.memberId,
      });

      await queryRunner.manager.delete(MemberFriend, {
        memberId: exFrnd.memberId,
        friendMemberId: data.memberId,
      });

      // 차단 목록에 등록
      const blockMember = new BlockMember();
      blockMember.memberId = data.memberId;
      blockMember.blockMemberId = exFrnd.memberId;

      await queryRunner.manager.getRepository(BlockMember).save(blockMember);

      await queryRunner.commitTransaction();

      return {
        error: ERRORCODE.NET_E_SUCCESS,
        message: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error({ error });
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_DB_FAILED,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_DB_FAILED),
        },
        HttpStatus.FORBIDDEN,
      );
    } finally {
      await queryRunner.release();
    }
  }

  // 친구 삭제
  async deleteFriend(data: GetCommonDto, friendMemeberCode: string) {
    // 요청한 친구 확인
    const exFrnd = await this.memberRepository.findOne({
      where: {
        memberCode: friendMemeberCode,
      },
    });

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
    const memberFriend = await this.memberFriendRepository.findOne({
      where: {
        memberId: data.memberId,
        friendMemberId: exFrnd.memberId,
      },
    });

    if (!memberFriend) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_ALREADY_FRIEND,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_ALREADY_FRIEND),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.delete(MemberFriend, {
        memberId: data.memberId,
        friendMemberId: exFrnd.memberId,
      });

      await queryRunner.manager.delete(MemberFriend, {
        memberId: exFrnd.memberId,
        friendMemberId: data.memberId,
      });

      await queryRunner.commitTransaction();

      return {
        error: ERRORCODE.NET_E_SUCCESS,
        message: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error({ error });
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_DB_FAILED,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_DB_FAILED),
        },
        HttpStatus.FORBIDDEN,
      );
    } finally {
      await queryRunner.release();
    }
  }

  // 친구 차단 해제 하기
  async releaseBlockFriend(data: GetCommonDto, friendMemeberCode: string) {
    // 차단 친구 확인
    const exFrnd = await this.memberRepository.findOne({
      where: {
        memberCode: friendMemeberCode,
      },
    });

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

    const blockMember = await this.blockMemberRepository.findOne({
      where: {
        memberId: data.memberId,
        blockMemberId: exFrnd.memberId,
      },
    });

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

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.delete(BlockMember, {
        memberId: data.memberId,
        blockMemberId: exFrnd.memberId,
      });

      await queryRunner.commitTransaction();

      return {
        error: ERRORCODE.NET_E_SUCCESS,
        message: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error({ error });
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_DB_FAILED,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_DB_FAILED),
        },
        HttpStatus.FORBIDDEN,
      );
    } finally {
      await queryRunner.release();
    }
  }

  // 친구 차단 목록 조회
  async getBlockFriends(data: GetCommonDto) {
    const blockMembers = await this.blockMemberRepository
      .createQueryBuilder('b')
      .select([
        'm.memberCode as memberCode',
        'm.nickname as nickname',
        'm.stateMessage as stateMessage',
      ])
      .innerJoin('member', 'm', 'm.memberId = b.blockMemberId')
      .where('b.memberid=:memberId', { memberId: data.memberId })
      .getRawMany();

    for (const f of blockMembers) {
      const avatarInfos = await this.commonService.getMemberAvatarInfo(
        f.memberCode,
      );
      f.avatarInfos = avatarInfos;
    }

    return {
      blockMembers,
      error: ERRORCODE.NET_E_SUCCESS,
      message: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
    };
  }

  // 친구 조회
  async findFriend(data: GetCommonDto, requestType: number, friendId: string) {
    // 해당 친구의 존재 여부 확인
    const m = await this.memberRepository
      .createQueryBuilder('m')
      .select([
        'm.memberCode as friendMemberCode',
        'm.nickname as friendNickname',
        'm.stateMessage as friendMessage',
      ]);

    switch (requestType) {
      case FRND_REQUEST_TYPE.MEMBER_CODE:
        m.where('m.memberCode=:memberCode', { memberCode: friendId });
        break;

      case FRND_REQUEST_TYPE.NICKNAME:
        m.where('m.nickname=:nickname', { nickname: friendId });
        break;
      default:
        throw new HttpException(
          {
            error: ERRORCODE.NET_E_DB_FAILED,
            message: ERROR_MESSAGE(ERRORCODE.NET_E_DB_FAILED),
          },
          HttpStatus.BAD_REQUEST,
        );
    }

    const member = await m.getRawOne();

    // 존재하지 않는다.
    if (!member) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_NOT_EXIST_USER,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_USER),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const avatarInfos = await this.commonService.getMemberAvatarInfo(
      member.friendMemberCode,
    );
    member.avatarInfos = avatarInfos;

    return {
      member,
      error: ERRORCODE.NET_E_SUCCESS,
      message: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
    };
  }

  // 친구 즐겨찾기
  async bookmark(data: CommonFriendDto) {
    // 즐겨찾기 친구 확인
    const exFrnd = await this.memberRepository.findOne({
      where: {
        memberCode: data.friendMemeberCode,
      },
    });

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

    // 친구 여부 확인
    const memberFriend = await this.memberFriendRepository.findOne({
      where: {
        memberId: data.memberId,
        friendMemberId: exFrnd.memberId,
      },
    });

    // 존재하지 않는다.
    if (!memberFriend) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_NOT_EXIST_USER,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_USER),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const newMemberFriend = new MemberFriend();
    newMemberFriend.memberId = data.memberId;
    newMemberFriend.friendMemberId = exFrnd.memberId;
    newMemberFriend.bookmark = memberFriend.bookmark === 1 ? 0 : 1;
    newMemberFriend.bookmarkedAt =
      memberFriend.bookmarkedAt === null ? new Date() : null;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager
        .getRepository(MemberFriend)
        .save(newMemberFriend);
      await queryRunner.commitTransaction();

      return {
        friendMemberCode: exFrnd.memberCode,
        bookmark: newMemberFriend.bookmark,
        bookmarkedAt: newMemberFriend.bookmarkedAt,
        error: ERRORCODE.NET_E_SUCCESS,
        message: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.error({ err });
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_DB_FAILED,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_DB_FAILED),
        },
        HttpStatus.FORBIDDEN,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async findRoomId(friendMemberCode: string) {
    try {
      const roomId = await this.dataSource
        .getRepository(MemberConnectInfo)
        .createQueryBuilder('m')
        .select('m.roomId as roomId')
        .where('m.memberCode = :memberCode', { memberCode: friendMemberCode })
        .getRawOne();

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

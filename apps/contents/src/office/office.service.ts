import { CreateReservDto } from './dto/request/create.reserv.dto';
import {
  Member,
  MemberLicenseInfo,
  MemberOfficeReservationInfo,
  MemberOfficeReservationWaitingInfo,
  OfficeGradeAuthority,
  OfficeRoomCodeLog,
  OfficeSpaceInfo,
} from '@libs/entity';
import {
  Inject,
  Injectable,
  HttpException,
  HttpStatus,
  Logger,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, QueryRunner } from 'typeorm';
import { GetCommonDto } from '../dto/get.common.dto';
import {
  AzureBlobService,
  JwtService,
  StartedUnixTimestamp,
} from '@libs/common';
import { BOOLEAN, ERRORCODE, ERROR_MESSAGE } from '@libs/constants';
import { CreateWaitDto } from './dto/request/create.wait.dto';
import dayjs from 'dayjs';

@Injectable()
export class OfficeService {
  private readonly logger = new Logger(OfficeService.name);
  constructor(
    @InjectRepository(Member) private memberRepository: Repository<Member>,
    @InjectRepository(MemberOfficeReservationInfo)
    private memberOfficeReservdRepository: Repository<MemberOfficeReservationInfo>,
    @InjectRepository(MemberOfficeReservationWaitingInfo)
    private memberOfficeReservWaitInfoRepository: Repository<MemberOfficeReservationWaitingInfo>,
    @InjectRepository(OfficeGradeAuthority)
    private officeGradeAuthRepository: Repository<OfficeGradeAuthority>,
    @InjectRepository(OfficeSpaceInfo)
    private officeSpaceInfoRespository: Repository<OfficeSpaceInfo>,
    private azureBlobService: AzureBlobService,
    private jwtService: JwtService,
    @Inject(DataSource) private dataSource: DataSource,
  ) {}

  // 룸코드 생성
  async createRoomCode() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const roomCode = await this.GetOfficeRoomCode(queryRunner);
      await queryRunner.commitTransaction();
      return { roomCode };
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  // 룸 정보 조회
  async getRoomInfo(data: GetCommonDto, roomCode: string) {
    const officeRoomInfo = await this.dataSource.query(
      `SELECT 
      name AS roomName, 
      roomCode, 
      modeType, 
      topicType, 
      description,
      runningTime,
      spaceInfoId, 
      personnel, 
      alarmType,
      isAdvertising,
      isWaitingRoom,
      observer,
      thumbnail,
      reservationAt, 
      repeatDay, 
      startTime, 
      member.nickname AS nickname,
      member.memberCode AS memberCode,
      CASE WHEN password IS NULL then 0
        ELSE 1 END AS isPassword
      FROM memberOfficeReservationInfo mr 
      INNER JOIN member member ON member.memberId = mr.memberId 
      WHERE mr.roomCode = ?`,
      [roomCode],
    );

    if (officeRoomInfo.length < 1) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_NOT_EXIST_OFFICE,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_OFFICE),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    return {
      officeRoomInfo: officeRoomInfo[0],
      error: ERRORCODE.NET_E_SUCCESS,
      message: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
    };
  }

  // 룸 코드 패스워드 확인
  async checkRoomCodePassword(roomCode: string, password: string) {
    const office = await this.memberOfficeReservdRepository.findOne({
      where: {
        roomCode: roomCode,
        password: password,
      },
    });

    if (!office) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_NOT_MATCH_PASSWORD,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_MATCH_PASSWORD),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    return {
      error: ERRORCODE.NET_E_SUCCESS,
      errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
    };
  }

  // 나의 예약 목록 조회
  async getReservInfo(data: GetCommonDto) {
    const info = await this.dataSource.query(
      `SELECT 
      name AS roomName, 
      roomCode as roomCode, 
      modeType, 
      topicType, 
      description,
      runningTime,
      spaceInfoId, 
      personnel, 
      alarmType,
      isAdvertising,
      isWaitingRoom,
      observer,
      thumbnail,
      reservationAt, 
      repeatDay, 
      startTime, 
      password,
      CASE WHEN password IS NULL then 0
      ELSE 1 END AS isPassword,
      member.nickname AS nickname,
      member.memberCode AS memberCode
      FROM memberOfficeReservationInfo mr 
      INNER JOIN member member ON member.memberId = mr.memberId 
      WHERE mr.memberId = ? and modeType <> 5`,
      [data.memberId],
    );

    return {
      error: ERRORCODE.NET_E_SUCCESS,
      message: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
      myReservations: info,
    };
  }

  // 나의 대기 목록 조회
  async getWaitInfo(data: GetCommonDto) {
    const info = await this.dataSource.query(
      `SELECT mr.name AS roomName, 
      mr.roomCode as roomCode,
      mr.modeType as modeType, 
      mr.topicType as topicType, 
      mr.description As description, 
      mr.runningTime as runningTime,
      mr.spaceInfoId as spaceInfoId,
      mr.personnel as personnel,
      mr.alarmType as alarmType,
      mr.isAdvertising as isAdvertising,
      mr.isWaitingRoom as isWaitingRoom,
      mr.observer as observer,
      mr.thumbnail as thumbnail,
      mr.reservationAt as reservationAt, 
      mr.repeatDay as repeatDay, 
      mr.startTime As startTime,
      CASE WHEN password IS NULL then 0
        ELSE 1 END AS isPassword,
      member.nickname AS nickname,
      member.memberCode AS memberCode
        FROM memberOfficeReservationWaitingInfo mw INNER JOIN memberOfficeReservationInfo mr ON mw.reservationId = mr.id
        INNER JOIN member member ON member.memberId = mr.memberId 
        WHERE mw.memberId = ? and modeType <> 5`,
      [data.memberId],
    );

    return {
      error: ERRORCODE.NET_E_SUCCESS,
      message: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
      myWaitings: info,
    };
  }

  // 오피스 대기 하기
  async waitOfficeReserv(data: CreateWaitDto) {
    console.log(data);
    const reservationInfo = await this.memberOfficeReservdRepository.findOne({
      where: {
        roomCode: data.roomCode,
      },
    });

    if (!reservationInfo) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_NOT_EXIST_OFFICE,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_OFFICE),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    if (reservationInfo.memberId === data.memberId) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_OFFICE_CREATE_ME,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_OFFICE_CREATE_ME),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const waitingReservation = new MemberOfficeReservationWaitingInfo();
      waitingReservation.reservationId = reservationInfo.id;
      waitingReservation.memberId = data.memberId;

      await queryRunner.manager.save(waitingReservation);
      await queryRunner.commitTransaction();

      return {
        error: ERRORCODE.NET_E_SUCCESS,
        message: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(error);
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

  // 오피스 예약 취소
  async deleteReservation(data: GetCommonDto, roomCode: string) {
    const exReserv = await this.memberOfficeReservdRepository.findOne({
      where: {
        roomCode: roomCode,
        memberId: data.memberId,
      },
    });

    if (!exReserv) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_NOT_EXIST_OFFICE,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_OFFICE),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.delete(MemberOfficeReservationInfo, {
        id: exReserv.id,
      });

      if (exReserv.thumbnail) {
        const path = `office/${roomCode}/${exReserv.thumbnail}`;
        await this.azureBlobService.deletefile(path);
      }
      await queryRunner.commitTransaction();

      return {
        roomCode: roomCode,
        error: ERRORCODE.NET_E_SUCCESS,
        message: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(error);
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

  // 오피스 대기 취소
  async deleteWaiting(data: GetCommonDto, roomCode: string) {
    const exReserv = await this.memberOfficeReservdRepository.findOne({
      where: {
        roomCode: roomCode,
      },
    });

    if (!exReserv) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_NOT_EXIST_OFFICE,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_OFFICE),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const exWait = await this.memberOfficeReservWaitInfoRepository.findOne({
      where: {
        reservationId: exReserv.id,
        memberId: data.memberId,
      },
    });

    if (!exWait) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_NOT_EXIST_WAITING,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_WAITING),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.delete(MemberOfficeReservationWaitingInfo, {
        reservationId: exReserv.id,
      });
      await queryRunner.commitTransaction();

      return {
        roomCode: roomCode,
        error: ERRORCODE.NET_E_SUCCESS,
        message: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(error);
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

  // 홍보 노츨 리스트 조회
  async getIsAdvertisingList() {
    const advertisingOfficeList = await this.dataSource.query(
      `SELECT 
      name AS roomName, 
      roomCode, 
      modeType, 
      topicType, 
      description,
      runningTime,
      spaceInfoId, 
      personnel, 
      alarmType,
      isAdvertising,
      isWaitingRoom,
      observer,
      thumbnail,
      reservationAt, 
      repeatDay, 
      startTime, 
      member.nickname AS nickname,
      member.memberCode AS memberCode,
      CASE WHEN password IS NULL then 0
        ELSE 1 END AS isPassword
      FROM memberOfficeReservationInfo mr 
      INNER JOIN member member ON member.memberId = mr.memberId 
      WHERE mr.isAdvertising = ?`,
      [1],
    );

    return {
      advertisingOfficeList,
      error: ERRORCODE.NET_E_SUCCESS,
      message: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
    };
  }

  // 룸코드 검증 및 로그 저장
  GetOfficeRoomCode = async (queryRunner: QueryRunner) => {
    while (true) {
      const roomCode = await this.RoomCodeGenerator();
      const data = await this.memberOfficeReservdRepository.findOne({
        where: {
          roomCode: roomCode!,
        },
      });

      if (!data) {
        this.logger.debug(roomCode);

        const log = new OfficeRoomCodeLog();
        log.roomCode = roomCode;

        await queryRunner.manager.getRepository(OfficeRoomCodeLog).save(log);

        return roomCode;
      }
    }
  };

  // 룸코드 생성
  RoomCodeGenerator(): string {
    let code: string = '';

    for (let index = 0; index < 8; index++) {
      const rand_0_9 = Math.floor(Math.random() * 10);
      code += String(rand_0_9);
    }

    return code;
  }

  // 오피스 생성 하기
  async CreateOffice(
    file: Express.Multer.File,
    memberId: string,
    data: CreateReservDto,
  ) {
    if (
      !data.reservationAt &&
      (Number(data.repeatDay) === 0 || !data.repeatDay)
    ) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_NOT_SET_RESERVATION_TIME,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_SET_RESERVATION_TIME),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const now = new Date();

    // 예약 시간 검증
    if (data.reservationAt) {
      const _reservationAt = new Date(data.reservationAt + ' 00:00:00');
      _reservationAt.setMinutes(Number(data.startTime));

      if (_reservationAt <= now) {
        throw new HttpException(
          {
            error: ERRORCODE.NET_E_WRONG_RESERVATION_TIME,
            message: ERROR_MESSAGE(ERRORCODE.NET_E_WRONG_RESERVATION_TIME),
          },
          HttpStatus.FORBIDDEN,
        );
      }
    }

    // 사용자 조회
    const member = await this.memberRepository.findOne({
      where: {
        memberId: memberId,
      },
    });

    if (!member) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_NOT_EXIST_USER,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_USER),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    // 회원 등급 권한 조회
    const gradeAuthority = await this.officeGradeAuthRepository.findOne({
      where: {
        gradeType: member.officeGradeType,
      },
    });

    if (!gradeAuthority) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_OFFICE_GRADE_AUTHORITY,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_OFFICE_GRADE_AUTHORITY),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    // 룸 예약 제한이 있는 경우 기존 예약 검색 후 비교
    if (gradeAuthority.reserveLimit !== 0) {
      const reservation = await this.memberOfficeReservdRepository
        .createQueryBuilder('re')
        .select('COUNT(*) as count')
        .where('re.memberId = :memberId', { memberId: memberId })
        .andWhere('re.reservationAt >= NOW()')
        .getRawOne();

      if (reservation.count >= gradeAuthority.reserveLimit) {
        throw new HttpException(
          {
            error: ERRORCODE.NET_E_OVER_CREATE_OFFICE_RESERVATION_COUNT,
            message: ERROR_MESSAGE(
              ERRORCODE.NET_E_OVER_CREATE_OFFICE_RESERVATION_COUNT,
            ),
          },
          HttpStatus.FORBIDDEN,
        );
      }
    }

    // 공간 선택 조회
    const spaceInfo = await this.officeSpaceInfoRespository.findOne({
      where: {
        id: Number(data.spaceInfoId),
        modeType: Number(data.modeType),
      },
    });

    if (!spaceInfo) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_ERROR_SELECT_OFFICE_ROOM_INFO,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_ERROR_SELECT_OFFICE_ROOM_INFO),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    // 관전 인원 설정 체크
    if (gradeAuthority.isObserver) {
      if (spaceInfo.maxObserver < Number(data.observer)) {
        throw new HttpException(
          {
            error: ERRORCODE.NET_E_CANNOT_OFFICE_SET_OBSERVER,
            message: ERROR_MESSAGE(ERRORCODE.NET_E_CANNOT_OFFICE_SET_OBSERVER),
          },
          HttpStatus.FORBIDDEN,
        );
      }
    } else {
      if (Number(data.observer) > 0) {
        throw new HttpException(
          {
            error: ERRORCODE.NET_E_OVER_MAX_OFFICE_SET_OBSERVER,
            message: ERROR_MESSAGE(
              ERRORCODE.NET_E_OVER_MAX_OFFICE_SET_OBSERVER,
            ),
          },
          HttpStatus.FORBIDDEN,
        );
      }
    }

    // 인원 설정 체크
    if (gradeAuthority.capacityLimit !== 0) {
      if (Number(data.personnel) > gradeAuthority.capacityLimit) {
        throw new HttpException(
          {
            error: ERRORCODE.NET_E_OVER_MAX_PERSONNEL,
            message: ERROR_MESSAGE(ERRORCODE.NET_E_OVER_MAX_PERSONNEL),
          },
          HttpStatus.FORBIDDEN,
        );
      }
    } else {
      if (Number(data.personnel) > spaceInfo.maxCapacity) {
        throw new HttpException(
          {
            error: ERRORCODE.NET_E_OVER_MAX_PERSONNEL,
            message: ERROR_MESSAGE(ERRORCODE.NET_E_OVER_MAX_PERSONNEL),
          },
          HttpStatus.FORBIDDEN,
        );
      }
    }

    // 진행 시간 체크
    if (Number(data.runningTime) > gradeAuthority.timeLimit) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_OVER_RUNNING_TIME,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_OVER_RUNNING_TIME),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    /* 고급 기능 체크 */

    // 썸네일 설정 체크
    if (gradeAuthority.isThumbnail === BOOLEAN.FALSE && file) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_CANNOT_SET_THUMBNAIL,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_CANNOT_SET_THUMBNAIL),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    if (
      gradeAuthority.isAdvertising === BOOLEAN.FALSE &&
      Number(data.isAdvertising) === BOOLEAN.TRUE
    ) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_CANNOT_SET_ADVERTISING,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_CANNOT_SET_ADVERTISING),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    if (
      gradeAuthority.isWaitingRoom === BOOLEAN.FALSE &&
      Number(data.isWaitingRoom) === BOOLEAN.TRUE
    ) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_CANNOT_SET_WAITING_ROOM,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_CANNOT_SET_WAITING_ROOM),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const roomCode = await this.GetOfficeRoomCode(queryRunner);

      const mr = new MemberOfficeReservationInfo();
      if (data.reservationAt) mr.reservationAt = new Date(data.reservationAt);
      if (data.repeatDay) mr.repeatDay = Number(data.repeatDay);
      if (data.password) mr.password = data.password;
      else mr.password = null;

      mr.name = data.name;
      mr.description = data.description;
      mr.personnel = Number(data.personnel);
      mr.runningTime = Number(data.runningTime);
      mr.alarmType = Number(data.alarmType);
      mr.topicType = Number(data.topicType);
      mr.modeType = Number(data.modeType);
      mr.spaceInfoId = Number(data.spaceInfoId);
      mr.isAdvertising = Number(data.isAdvertising);
      mr.isWaitingRoom = Number(data.isWaitingRoom);
      mr.startTime = Number(data.startTime);
      mr.observer = Number(data.observer);
      mr.memberId = memberId;
      mr.roomCode = roomCode;

      if (file) {
        const filename = decodeURIComponent(file.originalname);
        const timestamp = new Date().getTime();
        const fileNameArr = filename.split('.');
        const extName = fileNameArr[1];

        mr.thumbnail = `${timestamp}_${fileNameArr[0]}.${extName}`;
      }

      await queryRunner.manager
        .getRepository(MemberOfficeReservationInfo)
        .save(mr);

      if (gradeAuthority.isThumbnail === 1 && file) {
        await this.azureBlobService.deleteFolder(`office/${mr.roomCode}`);
        const path = `office/${mr.roomCode}/${mr.thumbnail}`;
        await this.azureBlobService.upload(file, path);
      }

      await queryRunner.commitTransaction();

      const memberReserv = await this.memberOfficeReservdRepository
        .createQueryBuilder('m')
        .select([
          'roomCode',
          'name as roomName',
          'modeType',
          'topicType',
          'description',
          'runningTime',
          'spaceInfoId',
          'personnel',
          'alarmType',
          'isAdvertising',
          'isWaitingRoom',
          'observer',
          'thumbnail',
          'reservationAt',
          'repeatDay',
          'startTime',
          'password',
          'member.nickname as nickname',
          'member.memberCode as memberCode',
        ])
        .innerJoin('m.Member', 'member')
        .where('id= :id', {
          id: mr.id,
        })
        .getRawOne();

      return {
        memberReservationInfo: memberReserv,
        error: ERRORCODE.NET_E_SUCCESS,
        errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(error);
      if (error instanceof ForbiddenException) {
        throw error;
      } else {
        throw new HttpException(
          {
            error: ERRORCODE.NET_E_DB_FAILED,
            message: ERROR_MESSAGE(ERRORCODE.NET_E_DB_FAILED),
          },
          HttpStatus.FORBIDDEN,
        );
      }
    } finally {
      await queryRunner.release();
    }
  }

  // 오피스 예약 편집 하기
  async UpdateOffice(
    file: Express.Multer.File,
    memberId: string,
    roomCode: string,
    data: any,
  ) {
    const office = await this.memberOfficeReservdRepository.findOne({
      where: {
        roomCode: roomCode,
      },
    });

    if (!office) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_NOT_EXIST_OFFICE,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_OFFICE),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const now = new Date();
    const newOffice = new MemberOfficeReservationInfo();

    let isTimeError = false;
    let startDate = null;
    let startTime = null;

    // 예약 날짜와 시간을 모두 변경 하려는 경우
    if (data.reservationAt && data.startTime) {
      startTime = data.startTime;
      startDate = data.reservationAt;
    } else {
      // 예약 날짜만 변경 하는 경우
      if (data.reservationAt) {
        startTime = office.startTime;
        startDate = data.reservationAt;
      } else {
        // 시간만 변경 하는 경우
        startTime = data.startTime;
        startDate = office.reservationAt;
      }
    }

    if (startTime) {
      const _reservationAt = new Date(startDate + ' 00:00:00');
      _reservationAt.setMinutes(startTime);
      console.log(dayjs(_reservationAt).format('YYYY-MM-DD HH:mm:ss'));
      if (_reservationAt <= now) {
        isTimeError = true;
      }
    }

    if (isTimeError) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_WRONG_RESERVATION_TIME,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_WRONG_RESERVATION_TIME),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    if (data.reservationAt) newOffice.reservationAt = data.reservationAt;
    if (data.startTime) newOffice.startTime = data.startTime;
    if (data.topicType) newOffice.topicType = data.topicType;
    if (data.repeatDay) newOffice.repeatDay = data.repeatDay;
    if (data.alarmType) newOffice.alarmType = data.alarmType;
    if (data.description) newOffice.description = data.description;

    if (data.password) newOffice.password = data.password;
    else newOffice.password = null;

    // 사용자 조회
    const member = await this.memberRepository.findOne({
      where: {
        memberId: memberId,
      },
    });

    if (!member) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_NOT_EXIST_USER,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_USER),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    // 회원 등급 권한 조회
    const gradeAuthority = await this.officeGradeAuthRepository.findOne({
      where: {
        gradeType: member.officeGradeType,
      },
    });

    let spaceInfo = null;
    if (data.modeType && data.spaceInfoId) {
      // 공간 선택 조회
      spaceInfo = await this.officeSpaceInfoRespository.findOne({
        where: {
          id: data.spaceInfoId,
          modeType: data.modeType,
        },
      });

      if (!spaceInfo) {
        throw new HttpException(
          {
            error: ERRORCODE.NET_E_ERROR_SELECT_OFFICE_ROOM_INFO,
            message: ERROR_MESSAGE(
              ERRORCODE.NET_E_ERROR_SELECT_OFFICE_ROOM_INFO,
            ),
          },
          HttpStatus.FORBIDDEN,
        );
      }

      newOffice.modeType = data.modeType;
    } else {
      spaceInfo = await this.officeSpaceInfoRespository.findOne({
        where: {
          id: office.spaceInfoId,
          modeType: office.modeType,
        },
      });
    }

    if (data.name) {
      newOffice.name = data.name;
    }

    // 관전 인원 설정 체크
    if (data.observer) {
      // 관전자 설정 가능
      if (gradeAuthority.isObserver) {
        if (spaceInfo.maxObserver < data.observer) {
          throw new HttpException(
            {
              error: ERRORCODE.NET_E_CANNOT_OFFICE_SET_OBSERVER,
              message: ERROR_MESSAGE(
                ERRORCODE.NET_E_CANNOT_OFFICE_SET_OBSERVER,
              ),
            },
            HttpStatus.FORBIDDEN,
          );
        }

        newOffice.observer = data.observer;
      } else {
        // 관전자 설정 불가
        if (data.observer > 0) {
          throw new HttpException(
            {
              error: ERRORCODE.NET_E_OVER_MAX_OFFICE_SET_OBSERVER,
              message: ERROR_MESSAGE(
                ERRORCODE.NET_E_OVER_MAX_OFFICE_SET_OBSERVER,
              ),
            },
            HttpStatus.FORBIDDEN,
          );
        }
      }
    }

    // 인원 설정 체크
    if (data.personnel) {
      // 인원 제한이 있는 권한이면
      if (gradeAuthority.capacityLimit !== 0) {
        if (data.personnel > gradeAuthority.capacityLimit) {
          throw new HttpException(
            {
              error: ERRORCODE.NET_E_OVER_MAX_PERSONNEL,
              message: ERROR_MESSAGE(ERRORCODE.NET_E_OVER_MAX_PERSONNEL),
            },
            HttpStatus.FORBIDDEN,
          );
        }
      } else {
        // 인원 제한이 없는 권한이면 공간 인원 제한을 참조
        if (data.personnel > spaceInfo.maxCapacity) {
          throw new HttpException(
            {
              error: ERRORCODE.NET_E_OVER_MAX_PERSONNEL,
              message: ERROR_MESSAGE(ERRORCODE.NET_E_OVER_MAX_PERSONNEL),
            },
            HttpStatus.FORBIDDEN,
          );
        }
      }

      newOffice.personnel = data.personnel;
    }

    if (data.runningTime) {
      // 진행 시간 체크
      if (data.runningTime > gradeAuthority.timeLimit) {
        throw new HttpException(
          {
            error: ERRORCODE.NET_E_OVER_RUNNING_TIME,
            message: ERROR_MESSAGE(ERRORCODE.NET_E_OVER_RUNNING_TIME),
          },
          HttpStatus.FORBIDDEN,
        );
      }

      newOffice.runningTime = data.runningTime;
    }

    /* 고급 기능 체크 */

    if (gradeAuthority.isThumbnail) {
      // 썸네일 설정 체크
      if (gradeAuthority.isThumbnail === BOOLEAN.FALSE && file) {
        throw new HttpException(
          {
            error: ERRORCODE.NET_E_CANNOT_SET_THUMBNAIL,
            message: ERROR_MESSAGE(ERRORCODE.NET_E_CANNOT_SET_THUMBNAIL),
          },
          HttpStatus.FORBIDDEN,
        );
      }
    }

    if (data.isAdvertising) {
      if (
        gradeAuthority.isAdvertising === BOOLEAN.FALSE &&
        data.isAdvertising === BOOLEAN.TRUE
      ) {
        throw new HttpException(
          {
            error: ERRORCODE.NET_E_CANNOT_SET_ADVERTISING,
            message: ERROR_MESSAGE(ERRORCODE.NET_E_CANNOT_SET_ADVERTISING),
          },
          HttpStatus.FORBIDDEN,
        );
      }

      newOffice.isAdvertising = data.isAdvertising;
    }

    if (data.isWaitingRoom) {
      if (
        gradeAuthority.isWaitingRoom === BOOLEAN.FALSE &&
        data.isWaitingRoom === BOOLEAN.TRUE
      ) {
        throw new HttpException(
          {
            error: ERRORCODE.NET_E_CANNOT_SET_WAITING_ROOM,
            message: ERROR_MESSAGE(ERRORCODE.NET_E_CANNOT_SET_WAITING_ROOM),
          },
          HttpStatus.FORBIDDEN,
        );
      }

      newOffice.isWaitingRoom = data.isWaitingRoom;
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (file) {
        const filename = decodeURIComponent(file.originalname);
        const timestamp = new Date().getTime();
        const fileNameArr = filename.split('.');
        const extName = fileNameArr[1];

        newOffice.thumbnail = `${timestamp}_${fileNameArr[0]}.${extName}`;
      } else {
        // 이미지 삭제
        if (Number(data.isDelete) === BOOLEAN.TRUE) {
          await this.azureBlobService.deleteFolder(
            `office/${office.roomCode}/`,
          );
          newOffice.thumbnail = null;
        }
      }
      console.log(newOffice);

      await queryRunner.manager
        .getRepository(MemberOfficeReservationInfo)
        .update({ id: office.id }, newOffice);

      if (gradeAuthority.isThumbnail === BOOLEAN.TRUE && file) {
        await this.azureBlobService.deleteFolder(`office/${office.roomCode}/`);
        const path = `office/${office.roomCode}/${newOffice.thumbnail}`;

        await this.azureBlobService.upload(file, path);
      }

      await queryRunner.commitTransaction();

      const memberReserv = await this.memberOfficeReservdRepository
        .createQueryBuilder('m')
        .select([
          'roomCode',
          'name as roomName',
          'modeType',
          'topicType',
          'description',
          'runningTime',
          'spaceInfoId',
          'personnel',
          'alarmType',
          'isAdvertising',
          'isWaitingRoom',
          'observer',
          'thumbnail',
          'reservationAt',
          'repeatDay',
          'startTime',
          'password',
          'member.nickname as nickname',
          'member.memberCode as memberCode',
        ])
        .innerJoin('m.Member', 'member')
        .where('id= :id', {
          id: office.id,
        })
        .getRawOne();

      return {
        memberReservationInfo: memberReserv,
        error: ERRORCODE.NET_E_SUCCESS,
        errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(error);
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

  // 사용자의 전시 행사 관리자 권한 조회
  async getExhibitionAuth(memberId: string) {
    const memberLicenseInfo = await this.dataSource
      .getRepository(MemberLicenseInfo)
      .createQueryBuilder('m')
      .select([
        'csfaEventInfo.startedAt as startedAt',
        'csfaEventInfo.endedAt as endedAt',
      ])
      .innerJoin('m.LicenseInfo', 'licenseInfo')
      .innerJoin('licenseInfo.LicenseGroupInfo', 'licenseGroupInfo')
      .innerJoin('licenseGroupInfo.CSFAEventInfo', 'csfaEventInfo')
      .where('m.memberId = :memberId', { memberId })
      .getRawOne();

    if (!memberLicenseInfo) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_OFFICE_GRADE_AUTHORITY,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_OFFICE_GRADE_AUTHORITY),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    console.log(typeof memberLicenseInfo.startedAt);
    if (
      new Date(memberLicenseInfo.startedAt) < new Date() &&
      new Date(memberLicenseInfo.endedAt) > new Date()
    ) {
      return {
        error: ERRORCODE.NET_E_SUCCESS,
        errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
      };
    } else {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_OFFICE_GRADE_AUTHORITY,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_OFFICE_GRADE_AUTHORITY),
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }
}

import { AzureBlobService } from '@libs/common';
import {
  BoothFileBoxInfo,
  CSAFEventBoothInfo,
  CSAFEventInfo,
  EachBoothBannerInfo,
  EachBoothScreenInfo,
  CSAFEventEnterLog,
  Member,
  MemberLicenseInfo,
  MemberOfficeReservationInfo,
} from '@libs/entity';
import {
  OFFICE_MODE_TYPE,
  ERRORCODE,
  ERROR_MESSAGE,
  APPEND_TYPE,
  UPLOAD_TYPE,
  BOOLEAN,
} from '@libs/constants';
import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { DataSource, LessThan, MoreThan, Repository } from 'typeorm';
import { CreateBannerDto, CreateScreenDto } from './dto/req/create.media.dto';
import { CreateFileboxDto } from './dto/req/create.filebox.dto';
import { UpdateFileboxDto } from './dto/req/update.filebox.dto';
import { UpdateMediaDto } from './dto/req/update.media.dto';
import { CreateBoothDto } from './dto/req/create.booth.dto';
import { OfficeService } from '../office/office.service';
import { UpdateBoothDto } from './dto/req/update.booth.dto';

@Injectable()
export class CsafService {
  constructor(
    private azureBlobService: AzureBlobService,
    private officeService: OfficeService,
    @Inject(DataSource) private dataSource: DataSource,
  ) {}
  private readonly logger = new Logger(CsafService.name);

  // 부스 목록 조회
  async getBooths() {
    try {
      const eventId = await this.getCurrentEvent();

      // 진행 중인 행사가 없음.
      if (!eventId) {
        throw new ForbiddenException({
          error: ERRORCODE.NET_E_DB_FAILED,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_DB_FAILED),
        });
      }

      // 현재 진행 중인 행사의 부스 조회 //
      const booths = await this.dataSource
        .getRepository(CSAFEventBoothInfo)
        .createQueryBuilder('cebi')
        .select([
          'boothInfo.id as id',
          'boothInfo.roomCode as roomCode',
          'boothInfo.name as name',
          'boothInfo.topicType as topicType',
          'boothInfo.description as description',
          'boothInfo.spaceInfoId as spaceInfoId',
          'boothInfo.thumbnail as thumbnail',
          'boothInfo.memberId as memberId',
          'boothInfo.isHide as isHide',
          'member.memberCode as memberCode',
          'member.nickname as nickname',
        ])
        .innerJoin('cebi.MemberOfficeReservationInfo', 'boothInfo')
        .innerJoin('boothInfo.Member', 'member')
        .where('cebi.eventId = :eventId', { eventId })
        .andWhere('boothInfo.modeType = :modeType', {
          modeType: OFFICE_MODE_TYPE.EXHIBITION,
        })
        .getRawMany();

      return {
        error: ERRORCODE.NET_E_SUCCESS,
        errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
        booths,
      };
    } catch (error) {
      console.log(error);
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
    }
  }

  // 부스 항목 조회
  async getBooth(boothId: number) {
    try {
      const booth = await this.dataSource
        .getRepository(MemberOfficeReservationInfo)
        .createQueryBuilder('m')
        .select([
          'm.id as id',
          'm.roomCode as roomCode',
          'm.name as name',
          'm.modeType as modeType',
          'm.topicType as topicType',
          'm.description as description',
          'm.spaceInfoId as spaceInfoId',
          'm.thumbnail as thumbnail',
          'member.nickname as nickname',
          'member.memberCode as memberCode',
          'm.memberId as memberId',
        ])
        .innerJoin('m.Member', 'member')
        .innerJoin('m.CSAFEventBoothInfos', 'cebi')
        .innerJoin('cebi.CSAFEventInfo', 'cei')
        .where('m.id= :id', {
          id: boothId,
        })
        .andWhere('m.isHide = 0')
        .andWhere('cei.startedAt < now() and cei.endedAt > now()')
        .getRawOne();

      if (!booth) {
        throw new ForbiddenException({
          error: ERRORCODE.NET_E_NOT_EXISTS_BOOTH,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXISTS_BOOTH),
        });
      }

      const bannerInfo = await this.dataSource
        .getRepository(EachBoothBannerInfo)
        .find({
          select: [
            'boothId',
            'bannerId',
            'uploadType',
            'uploadValue',
            'interactionType',
            'interactionValue',
          ],
          where: {
            boothId: Number(boothId),
          },
        });

      const screenInfo = await this.dataSource
        .getRepository(EachBoothScreenInfo)
        .find({
          select: [
            'boothId',
            'screenId',
            'uploadType',
            'uploadValue',
            'interactionType',
            'interactionValue',
          ],
          where: {
            boothId: Number(boothId),
          },
        });

      return {
        error: ERRORCODE.NET_E_SUCCESS,
        errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
        booth,
        bannerInfo,
        screenInfo,
      };
    } catch (error) {
      console.log(error);
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
    }
  }

  // 부스 이름으로 조회
  async getBoothByName(name: string) {
    try {
      const booth = await this.dataSource
        .getRepository(MemberOfficeReservationInfo)
        .createQueryBuilder('m')
        .select([
          'm.id as id',
          'm.roomCode as roomCode',
          'm.name as name',
          'm.modeType',
          'm.topicType',
          'm.description',
          'm.spaceInfoId',
          'm.thumbnail',
          'member.nickname as nickname',
          'member.memberCode as memberCode',
          'm.memberId as memberId',
        ])
        .innerJoin('m.Member', 'member')
        .innerJoin('m.CSAFEventBoothInfos', 'cebi')
        .innerJoin('cebi.CSAFEventInfo', 'cei')
        .where('m.name like :name', {
          name: `%${name}%`,
        })
        .andWhere('m.isHide = 0')
        .andWhere('m.modeType = :modeType', {
          modeType: OFFICE_MODE_TYPE.EXHIBITION,
        })
        .andWhere('cei.startedAt < now() and cei.endedAt > now()')
        .getRawMany();

      if (!booth) {
        throw new ForbiddenException({
          error: ERRORCODE.NET_E_NOT_EXISTS_BOOTH,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXISTS_BOOTH),
        });
      }

      return {
        error: ERRORCODE.NET_E_SUCCESS,
        errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
        booth,
      };
    } catch (error) {
      console.log(error);
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
    }
  }

  // 부스 만들기
  async createBooth(
    file: Express.Multer.File,
    memberId: string,
    data: CreateBoothDto,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const eventId = await this.getCurrentEvent();

      // 사용자가 라이선스 보유자인지 확인
      const license = await this.dataSource
        .getRepository(MemberLicenseInfo)
        .createQueryBuilder('ml')
        .innerJoin('ml.LicenseInfo', 'li')
        .innerJoin('li.LicenseGroupInfo', 'lgi')
        .where('lgi.eventId = :eventId', { eventId })
        .andWhere('ml.memberId = :memberId', { memberId })
        .getOne();

      if (!license) {
        throw new ForbiddenException({
          error: ERRORCODE.NET_E_HAVE_NOT_LICENSE_MEMBER,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_HAVE_NOT_LICENSE_MEMBER),
        });
      }

      // 사용자가 만든 부스가 존재 하는지 확인
      const booth = await this.dataSource
        .getRepository(CSAFEventBoothInfo)
        .createQueryBuilder('evi')
        .innerJoin('evi.MemberOfficeReservationInfo', 'boothInfo')
        .where('boothInfo.memberId = :memberId', { memberId })
        .andWhere('evi.eventId = :eventId', { eventId })
        .getOne();

      if (booth) {
        throw new ForbiddenException({
          error: ERRORCODE.NET_E_NOT_EXISTS_BOOTH,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXISTS_BOOTH),
        });
      }

      const roomCode = await this.officeService.GetOfficeRoomCode(queryRunner);

      const newBooth = new MemberOfficeReservationInfo();
      newBooth.name = data.name;
      newBooth.description = data.description;
      newBooth.topicType = Number(data.topicType);
      newBooth.modeType = OFFICE_MODE_TYPE.EXHIBITION;
      newBooth.spaceInfoId = Number(data.spaceInfoId);
      newBooth.memberId = memberId;
      newBooth.roomCode = roomCode;

      if (file) {
        file.originalname = decodeURIComponent(file.originalname);

        const timestamp = new Date().getTime();
        const fileNameArr = file.originalname.split('.');
        const extName = fileNameArr[1];

        newBooth.thumbnail = `${timestamp}_${fileNameArr[0]}.${extName}`;
      }

      await queryRunner.manager
        .getRepository(MemberOfficeReservationInfo)
        .insert(newBooth);

      const newBoothEvent = new CSAFEventBoothInfo();
      newBoothEvent.eventId = eventId;
      newBoothEvent.boothId = newBooth.id;

      await queryRunner.manager
        .getRepository(CSAFEventBoothInfo)
        .insert(newBoothEvent);

      if (file) {
        const path = `booth/${newBooth.id}/${newBooth.thumbnail}`;
        await this.azureBlobService.upload(file, path);
      }

      await queryRunner.commitTransaction();

      const boothInfo = await this.dataSource
        .getRepository(MemberOfficeReservationInfo)
        .createQueryBuilder('m')
        .select([
          'id as id',
          'roomCode as roomCode',
          'name as name',
          'modeType',
          'topicType',
          'description',
          'spaceInfoId',
          'thumbnail',
          'member.nickname as nickname',
          'member.memberCode as memberCode',
          'm.memberId as memberId',
        ])
        .innerJoin('m.Member', 'member')
        .where('id= :id', {
          id: newBooth.id,
        })
        .getRawOne();

      return {
        booth: boothInfo,
        error: ERRORCODE.NET_E_SUCCESS,
        errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
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

  // 부스 편집
  async updateBooth(
    file: Express.Multer.File,
    memberId: string,
    boothId: number,
    data: UpdateBoothDto,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 등록한 사용자가 해당 부스의 관리자인지 확인
      await this.isCurrentBoothAdmin(boothId, memberId);

      const prevBooth = await this.dataSource
        .getRepository(MemberOfficeReservationInfo)
        .findOne({
          where: {
            id: boothId,
          },
        });

      const newBooth = new MemberOfficeReservationInfo();

      if (data.name) newBooth.name = data.name;
      if (data.description) newBooth.description = data.description;
      if (data.topicType) newBooth.topicType = Number(data.topicType);
      if (data.spaceInfoId) newBooth.spaceInfoId = Number(data.spaceInfoId);

      if (file) {
        file.originalname = decodeURIComponent(file.originalname);

        const timestamp = new Date().getTime();
        const fileNameArr = file.originalname.split('.');
        const extName = fileNameArr[1];

        newBooth.thumbnail = `${timestamp}_${fileNameArr[0]}.${extName}`;
      } else {
        // 이미지 삭제
        if (Number(data.isDelete) === BOOLEAN.TRUE) {
          await this.azureBlobService.deleteFolder(`booth/${prevBooth.id}/`);
          newBooth.thumbnail = null;
        }
      }

      await queryRunner.manager
        .getRepository(MemberOfficeReservationInfo)
        .update({ id: boothId }, newBooth);

      if (file) {
        await this.azureBlobService.deleteFolder(`booth/${prevBooth.id}/`);
        const path = `booth/${prevBooth.id}/${newBooth.thumbnail}`;
        await this.azureBlobService.upload(file, path);
      }

      await queryRunner.commitTransaction();

      const boothInfo = await this.dataSource
        .getRepository(MemberOfficeReservationInfo)
        .createQueryBuilder('m')
        .select([
          'id as id',
          'roomCode as roomCode',
          'name as name',
          'modeType',
          'topicType',
          'description',
          'spaceInfoId',
          'thumbnail',
          'member.nickname as nickname',
          'member.memberCode as memberCode',
          'm.memberId as memberId',
        ])
        .innerJoin('m.Member', 'member')
        .where('id= :id', {
          id: boothId,
        })
        .getRawOne();

      return {
        booth: boothInfo,
        error: ERRORCODE.NET_E_SUCCESS,
        errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
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

  // 부스 삭제
  async deleteBooth(memberId: string, boothId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 등록한 사용자가 해당 부스의 관리자인지 확인
      await this.isCurrentBoothAdmin(boothId, memberId);

      await queryRunner.manager
        .getRepository(MemberOfficeReservationInfo)
        .delete({ id: boothId });

      // 모든 이미지 삭제
      await this.azureBlobService.deleteFolder(`booth/${boothId}/`);
      await this.azureBlobService.deleteFolder(`boothScreen/${boothId}/`);
      await this.azureBlobService.deleteFolder(`boothBanner/${boothId}/`);

      await queryRunner.commitTransaction();

      return {
        error: ERRORCODE.NET_E_SUCCESS,
        errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
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

  // 행사 입장
  async evnetEnter(memberId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const eventId = await this.getCurrentEvent();
      if (!eventId) {
        throw new ForbiddenException({
          error: ERRORCODE.NET_E_NOT_EXIST_EVENT,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_EVENT),
        });
      }

      const enterLog = new CSAFEventEnterLog();
      enterLog.eventId = eventId;
      enterLog.memberId = memberId;

      await queryRunner.manager
        .getRepository(CSAFEventEnterLog)
        .insert(enterLog);
      await queryRunner.commitTransaction();

      return {
        error: ERRORCODE.NET_E_SUCCESS,
        errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
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

  // 부스 배너 등록
  async createBoothBanner(
    file: Express.Multer.File,
    memberId: string,
    data: CreateBannerDto,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 등록한 사용자가 해당 부스의 관리자인지 확인
      await this.isCurrentBoothAdmin(Number(data.boothId), memberId);

      const newBannerInfo = new EachBoothBannerInfo();
      newBannerInfo.boothId = Number(data.boothId);
      newBannerInfo.bannerId = Number(data.bannerId);
      newBannerInfo.uploadType = Number(data.uploadType);
      newBannerInfo.interactionType = Number(data.interactionType);
      newBannerInfo.interactionValue = data.interactionValue;

      if (file) {
        file.originalname = decodeURIComponent(file.originalname);
        const timestamp = new Date().getTime();
        const fileNameArr = file.originalname.split('.');
        const extName = fileNameArr[1];

        newBannerInfo.uploadValue = `${timestamp}_${fileNameArr[0]}.${extName}`;
      } else {
        newBannerInfo.uploadValue = data.uploadValue;
      }

      await queryRunner.manager
        .getRepository(EachBoothBannerInfo)
        .insert(newBannerInfo);

      // 파일 확인 (파일 업로드인데 파일이 없다면? )
      if (Number(data.uploadType) === UPLOAD_TYPE.LOCAL_IMAGE && !file) {
        throw new ForbiddenException({
          error: ERRORCODE.NET_E_NOT_EXIST_IMAGE_FILE,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_IMAGE_FILE),
        });
      } // URL 경로 인데 파일이 있다면?
      else if (Number(data.uploadType) === UPLOAD_TYPE.IMAGE_URL && file) {
        throw new ForbiddenException({
          error: ERRORCODE.NET_E_DB_FAILED,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_DB_FAILED),
        });
      } else if (
        Number(data.uploadType) === UPLOAD_TYPE.IMAGE_URL &&
        !data.uploadValue
      ) {
        throw new ForbiddenException({
          error: ERRORCODE.NET_E_NOT_EXIST_IMAGE_URL,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_IMAGE_URL),
        });
      } else if (Number(data.uploadType) === UPLOAD_TYPE.LOCAL_IMAGE && file) {
        // 파일 업로드 하기
        const path = `boothBanner/${data.boothId}/${data.bannerId}/${newBannerInfo.uploadValue}`;
        await this.azureBlobService.upload(file, path);
      }
      await queryRunner.commitTransaction();

      const bannerInfo = await this.dataSource
        .getRepository(EachBoothBannerInfo)
        .findOne({
          select: [
            'boothId',
            'bannerId',
            'uploadType',
            'uploadValue',
            'interactionType',
            'interactionValue',
          ],
          where: {
            boothId: Number(data.boothId),
            bannerId: Number(data.bannerId),
          },
        });
      return {
        error: ERRORCODE.NET_E_SUCCESS,
        errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
        bannerInfo,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
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

  // 부스 스크린 등록
  async createBoothScreen(
    file: Express.Multer.File,
    memberId: string,
    data: CreateScreenDto,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 등록한 사용자가 해당 부스의 관리자인지 확인
      await this.isCurrentBoothAdmin(Number(data.boothId), memberId);

      const newScreenInfo = new EachBoothScreenInfo();
      newScreenInfo.boothId = Number(data.boothId);
      newScreenInfo.screenId = Number(data.screenId);
      newScreenInfo.uploadType = Number(data.uploadType);
      newScreenInfo.interactionType = Number(data.interactionType);
      newScreenInfo.interactionValue = data.interactionValue;

      if (file) {
        file.originalname = decodeURIComponent(file.originalname);

        const timestamp = new Date().getTime();
        const fileNameArr = file.originalname.split('.');
        const extName = fileNameArr[1];

        newScreenInfo.uploadValue = `${timestamp}_${fileNameArr[0]}.${extName}`;
      } else {
        newScreenInfo.uploadValue = data.uploadValue;
      }

      await queryRunner.manager
        .getRepository(EachBoothScreenInfo)
        .insert(newScreenInfo);

      // 파일 확인 (파일 업로드인데 파일이 없다면? )
      if (Number(data.uploadType) === UPLOAD_TYPE.LOCAL_IMAGE && !file) {
        throw new ForbiddenException({
          error: ERRORCODE.NET_E_NOT_EXIST_IMAGE_FILE,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_IMAGE_FILE),
        });
      } // URL 경로 인데 파일이 있다면?
      else if (Number(data.uploadType) === UPLOAD_TYPE.IMAGE_URL && file) {
        throw new ForbiddenException({
          error: ERRORCODE.NET_E_DB_FAILED,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_DB_FAILED),
        });
      } else if (
        Number(data.uploadType) === UPLOAD_TYPE.IMAGE_URL &&
        !data.uploadValue
      ) {
        throw new ForbiddenException({
          error: ERRORCODE.NET_E_NOT_EXIST_IMAGE_URL,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_IMAGE_URL),
        });
      } else if (Number(data.uploadType) === UPLOAD_TYPE.LOCAL_IMAGE && file) {
        // 파일 업로드 하기
        const path = `boothScreen/${data.boothId}/${data.screenId}/${newScreenInfo.uploadValue}`;
        await this.azureBlobService.upload(file, path);
      }
      await queryRunner.commitTransaction();

      const screenInfo = await this.dataSource
        .getRepository(EachBoothScreenInfo)
        .findOne({
          select: [
            'boothId',
            'screenId',
            'uploadType',
            'uploadValue',
            'interactionType',
            'interactionValue',
          ],
          where: {
            boothId: Number(data.boothId),
            screenId: Number(data.screenId),
          },
        });
      return {
        error: ERRORCODE.NET_E_SUCCESS,
        errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
        screenInfo,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
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

  // 부스 배너 편집
  async updateBoothBanner(
    file: Express.Multer.File,
    memberId: string,
    boothId: number,
    bannerId: number,
    data: UpdateMediaDto,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 등록한 사용자가 해당 부스의 관리자인지 확인
      await this.isCurrentBoothAdmin(boothId, memberId);

      // 파일 확인 (파일 업로드인데 파일이 없다면? )
      if (Number(data.uploadType) === UPLOAD_TYPE.LOCAL_IMAGE && !file) {
        throw new ForbiddenException({
          error: ERRORCODE.NET_E_NOT_EXIST_IMAGE_FILE,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_IMAGE_FILE),
        });
      }
      // URL 경로 인데 파일이 있다면?
      else if (Number(data.uploadType) === UPLOAD_TYPE.IMAGE_URL && file) {
        throw new ForbiddenException({
          error: ERRORCODE.NET_E_DB_FAILED,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_DB_FAILED),
        });
      } else if (
        Number(data.uploadType) === UPLOAD_TYPE.IMAGE_URL &&
        !data.uploadValue
      ) {
        throw new ForbiddenException({
          error: ERRORCODE.NET_E_NOT_EXIST_IMAGE_URL,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_IMAGE_URL),
        });
      }

      const newBannerInfo = new EachBoothBannerInfo();
      if (data.uploadType) newBannerInfo.uploadType = Number(data.uploadType);
      if (data.uploadValue) newBannerInfo.uploadValue = data.uploadValue;
      if (data.interactionType)
        newBannerInfo.interactionType = Number(data.interactionType);
      if (data.interactionValue)
        newBannerInfo.interactionValue = data.interactionValue;

      if (file) {
        file.originalname = decodeURIComponent(file.originalname);
        const timestamp = new Date().getTime();
        const fileNameArr = file.originalname.split('.');
        const extName = fileNameArr[1];

        newBannerInfo.uploadValue = `${timestamp}_${fileNameArr[0]}.${extName}`;
      }

      await queryRunner.manager
        .getRepository(EachBoothBannerInfo)
        .update({ boothId: boothId, bannerId: bannerId }, newBannerInfo);

      if (Number(data.uploadType) === UPLOAD_TYPE.LOCAL_IMAGE && file) {
        // 파일 업로드 하기
        await this.azureBlobService.deleteFolder(
          `boothBanner/${boothId}/${bannerId}/`,
        );

        const path = `boothBanner/${boothId}/${bannerId}/${newBannerInfo.uploadValue}`;
        await this.azureBlobService.upload(file, path);
      }

      await queryRunner.commitTransaction();

      const bannerInfo = await this.dataSource
        .getRepository(EachBoothBannerInfo)
        .findOne({
          select: [
            'boothId',
            'bannerId',
            'uploadType',
            'uploadValue',
            'interactionType',
            'interactionValue',
          ],
          where: {
            boothId: boothId,
            bannerId: bannerId,
          },
        });
      return {
        error: ERRORCODE.NET_E_SUCCESS,
        errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
        bannerInfo,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
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

  // 부스 스크린 편집
  async updateBoothScreen(
    file: Express.Multer.File,
    memberId: string,
    boothId: number,
    screenId: number,
    data: UpdateMediaDto,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 등록한 사용자가 해당 부스의 관리자인지 확인
      await this.isCurrentBoothAdmin(boothId, memberId);

      // 파일 확인 (파일 업로드인데 파일이 없다면? )
      if (Number(data.uploadType) === UPLOAD_TYPE.LOCAL_IMAGE && !file) {
        throw new ForbiddenException({
          error: ERRORCODE.NET_E_NOT_EXIST_IMAGE_FILE,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_IMAGE_FILE),
        });
      } // URL 경로 인데 파일이 있다면?
      else if (Number(data.uploadType) === UPLOAD_TYPE.IMAGE_URL && file) {
        throw new ForbiddenException({
          error: ERRORCODE.NET_E_DB_FAILED,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_DB_FAILED),
        });
      } else if (
        Number(data.uploadType) === UPLOAD_TYPE.IMAGE_URL &&
        !data.uploadValue
      ) {
        throw new ForbiddenException({
          error: ERRORCODE.NET_E_NOT_EXIST_IMAGE_URL,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_IMAGE_URL),
        });
      }

      const newScreenInfo = new EachBoothScreenInfo();
      if (data.uploadType) newScreenInfo.uploadType = Number(data.uploadType);
      if (data.uploadValue) newScreenInfo.uploadValue = data.uploadValue;
      if (data.interactionType)
        newScreenInfo.interactionType = Number(data.interactionType);
      if (data.interactionValue)
        newScreenInfo.interactionValue = data.interactionValue;

      if (file) {
        file.originalname = decodeURIComponent(file.originalname);
        const timestamp = new Date().getTime();
        const fileNameArr = file.originalname.split('.');
        const extName = fileNameArr[1];

        newScreenInfo.uploadValue = `${timestamp}_${fileNameArr[0]}.${extName}`;
      }

      await queryRunner.manager
        .getRepository(EachBoothScreenInfo)
        .update({ boothId: boothId, screenId: screenId }, newScreenInfo);

      // 파일 업로드 하기
      if (Number(data.uploadType) === UPLOAD_TYPE.LOCAL_IMAGE && file) {
        await this.azureBlobService.deleteFolder(
          `boothScreen/${boothId}/${screenId}/`,
        );

        const path = `boothScreen/${boothId}/${screenId}/${newScreenInfo.uploadValue}`;
        await this.azureBlobService.upload(file, path);
      }
      await queryRunner.commitTransaction();

      const screenInfo = await this.dataSource
        .getRepository(EachBoothScreenInfo)
        .findOne({
          select: [
            'boothId',
            'screenId',
            'uploadType',
            'uploadValue',
            'interactionType',
            'interactionValue',
          ],
          where: {
            boothId: boothId,
            screenId: screenId,
          },
        });
      return {
        error: ERRORCODE.NET_E_SUCCESS,
        errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
        screenInfo,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
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

  // 부스 배너 삭제
  async deleteBoothBanner(memberId, boothId, bannerId) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 등록한 사용자가 해당 부스의 관리자인지 확인
      await this.isCurrentBoothAdmin(boothId, memberId);

      // 배너 확인
      const bannerInfo = await this.dataSource
        .getRepository(EachBoothBannerInfo)
        .findOne({
          where: {
            bannerId: bannerId,
            boothId: boothId,
          },
        });

      if (!bannerInfo) {
        throw new ForbiddenException({
          error: ERRORCODE.NET_E_NOT_EXIST_IMAGE_FILE,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_IMAGE_FILE),
        });
      }

      // 삭제
      await queryRunner.manager
        .getRepository(EachBoothBannerInfo)
        .delete({ bannerId: bannerId, boothId: boothId });

      await this.azureBlobService.deleteFolder(
        `boothBanner/${boothId}/${bannerId}/`,
      );

      await queryRunner.commitTransaction();
      return {
        error: ERRORCODE.NET_E_SUCCESS,
        errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
      };
    } catch (error) {
      console.log(error);
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

  // 부스 스크린 삭제
  async deleteBoothScreen(memberId, boothId, screenId) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 등록한 사용자가 해당 부스의 관리자인지 확인
      await this.isCurrentBoothAdmin(boothId, memberId);

      // 배너 확인
      const screenInfo = await this.dataSource
        .getRepository(EachBoothScreenInfo)
        .findOne({
          where: {
            screenId: screenId,
            boothId: boothId,
          },
        });

      if (!screenInfo) {
        throw new ForbiddenException({
          error: ERRORCODE.NET_E_NOT_EXIST_IMAGE_FILE,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_IMAGE_FILE),
        });
      }

      // 삭제
      await queryRunner.manager
        .getRepository(EachBoothScreenInfo)
        .delete({ screenId: screenId, boothId: boothId });

      await this.azureBlobService.deleteFolder(
        `boothScreen/${boothId}/${screenId}/`,
      );

      await queryRunner.commitTransaction();
      return {
        error: ERRORCODE.NET_E_SUCCESS,
        errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
      };
    } catch (error) {
      console.log(error);
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

  // 파일함 목록 조회
  async getFileboxes(boothId: number) {
    try {
      const booth = await this.getCurrentBooth(boothId);
      if (!booth) {
        throw new ForbiddenException({
          error: ERRORCODE.NET_E_NOT_EXISTS_BOOTH,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXISTS_BOOTH),
        });
      }

      const fileboxes = await this.dataSource
        .getRepository(BoothFileBoxInfo)
        .createQueryBuilder('f')
        .select([
          'f.id as id',
          'f.boothId as boothId',
          'f.fileBoxType as fileBoxType',
          'f.fileName as fileName',
          'f.link as link',
          'f.updatedAt as updatedAt',
        ])
        .where('f.boothId = :boothId', { boothId })
        .getRawMany();

      return {
        error: ERRORCODE.NET_E_SUCCESS,
        errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
        fileboxes,
      };
    } catch (error) {
      console.log(error);
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
    }
  }

  // 파일함 등록
  async createFilebox(data: CreateFileboxDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 등록한 사용자가 해당 부스의 관리자인지 확인
      await this.isCurrentBoothAdmin(data.boothId, data.memberId);

      const newFilebox = new BoothFileBoxInfo();
      newFilebox.boothId = data.boothId;
      newFilebox.fileBoxType = data.fileBoxType;
      newFilebox.fileName = data.fileName;
      newFilebox.link = data.link;

      await queryRunner.manager
        .getRepository(BoothFileBoxInfo)
        .insert(newFilebox);
      await queryRunner.commitTransaction();

      const fileBox = await this.dataSource
        .getRepository(BoothFileBoxInfo)
        .findOne({
          select: [
            'id',
            'boothId',
            'fileBoxType',
            'fileName',
            'link',
            'updatedAt',
          ],
          where: {
            id: newFilebox.id,
          },
        });

      return {
        error: ERRORCODE.NET_E_SUCCESS,
        errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
        fileBox,
      };
    } catch (error) {
      console.log(error);
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

  // 파일함 편집
  async updateFilebox(boothId: number, fileId: number, data: UpdateFileboxDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 등록한 사용자가 해당 부스의 관리자인지 확인
      await this.isCurrentBoothAdmin(boothId, data.memberId);

      // 파일함 파일 확인
      const file = await this.dataSource
        .getRepository(BoothFileBoxInfo)
        .findOne({
          where: {
            id: fileId,
            boothId: boothId,
          },
        });

      if (!file) {
        throw new ForbiddenException({
          error: ERRORCODE.NET_E_NOT_EXIST_FILE,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_FILE),
        });
      }

      const newFilebox = new BoothFileBoxInfo();
      newFilebox.boothId = boothId;
      if (data.fileBoxType) newFilebox.fileBoxType = data.fileBoxType;
      if (data.fileName) newFilebox.fileName = data.fileName;
      if (data.link) newFilebox.link = data.link;

      await queryRunner.manager
        .getRepository(BoothFileBoxInfo)
        .update({ id: fileId }, newFilebox);
      await queryRunner.commitTransaction();

      const fileBox = await this.dataSource
        .getRepository(BoothFileBoxInfo)
        .findOne({
          select: [
            'id',
            'boothId',
            'fileBoxType',
            'fileName',
            'link',
            'updatedAt',
          ],
          where: {
            id: fileId,
          },
        });

      return {
        error: ERRORCODE.NET_E_SUCCESS,
        errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
        fileBox,
      };
    } catch (error) {
      console.log(error);
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

  // 파일함 삭제
  async deleteFilebox(memberId: string, boothId: number, fileId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 등록한 사용자가 해당 부스의 관리자인지 확인
      await this.isCurrentBoothAdmin(boothId, memberId);

      // 파일함 파일 확인
      const file = await this.dataSource
        .getRepository(BoothFileBoxInfo)
        .findOne({
          where: {
            id: fileId,
            boothId: boothId,
          },
        });

      if (!file) {
        throw new ForbiddenException({
          error: ERRORCODE.NET_E_NOT_EXIST_FILE,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_FILE),
        });
      }

      // 삭제
      await queryRunner.manager
        .getRepository(BoothFileBoxInfo)
        .delete({ id: fileId });
      await queryRunner.commitTransaction();
      return {
        error: ERRORCODE.NET_E_SUCCESS,
        errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
      };
    } catch (error) {
      console.log(error);
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

  private async getCurrentEvent(): Promise<number> {
    // 현재 진행 중인 행사 조회
    const eventInfo = await this.dataSource
      .getRepository(CSAFEventInfo)
      .findOne({
        where: {
          startedAt: LessThan(new Date()),
          endedAt: MoreThan(new Date()),
        },
      });

    // 진행 중인 행사가 없음.
    if (!eventInfo) {
      throw new ForbiddenException({
        error: ERRORCODE.NET_E_NOT_EXIST_EVENT,
        message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_EVENT),
      });
    }

    return eventInfo.id;
  }

  private async getCurrentBooth(
    boothId: number,
  ): Promise<MemberOfficeReservationInfo> {
    const eventId = await this.getCurrentEvent();

    // 현재 이벤트에 있는 부스 여부 확인
    const eventBooth = await this.dataSource
      .getRepository(CSAFEventBoothInfo)
      .findOne({
        where: {
          eventId: eventId,
          boothId: boothId,
        },
      });

    // 현재 이벤트에 없는 부스 이다.
    if (!eventBooth) {
      throw new ForbiddenException({
        error: ERRORCODE.NET_E_NOT_EXISTS_BOOTH,
        message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXISTS_BOOTH),
      });
    }

    // 부스 정보 가져오기
    const booth = await this.dataSource
      .getRepository(MemberOfficeReservationInfo)
      .findOne({
        where: {
          id: boothId,
        },
      });

    return booth;
  }

  private async isCurrentBoothAdmin(boothId: number, memberId: string) {
    const booth = await this.getCurrentBooth(boothId);

    // 등록한 사용자가 해당 부스의 관리자인지 확인
    if (booth.memberId !== memberId) {
      throw new ForbiddenException({
        error: ERRORCODE.NET_E_UNAUTHORIZE_ADMIN,
        message: ERROR_MESSAGE(ERRORCODE.NET_E_UNAUTHORIZE_ADMIN),
      });
    }
  }
}

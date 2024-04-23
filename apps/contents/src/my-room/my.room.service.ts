import {
  InteriorInstallInfo,
  Member,
  MemberFrameImage,
  MemberFurnitureItemInven,
  MemberMyRoomInfo,
} from '@libs/entity';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { AzureBlobService } from '@libs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { GetOthersMyRoomDto } from './dto/request/get.others.my.room.dto';
import { CommonService } from '@libs/common';
import {
  BOOLEAN,
  ERRORCODE,
  ERROR_MESSAGE,
  UPLOAD_TYPE,
} from '@libs/constants';
import { CreateMyRoomDto } from './dto/request/create.my.room.dto';
import { UpdateFrameImageDto } from './dto/request/update.frame.image.dto';
import { UpdateStateTypeDto } from './dto/request/update.state.dto';

@Injectable()
export class MyRoomService {
  constructor(
    @InjectRepository(Member) private memberRepository: Repository<Member>,
    private commonService: CommonService,
    private azureBlobService: AzureBlobService,
    @Inject(DataSource) private dataSource: DataSource,
  ) {}
  private readonly logger = new Logger(MyRoomService.name);
  async getPostOthersRoomList(req: GetOthersMyRoomDto) {
    const exMember = await this.memberRepository.findOne({
      where: {
        memberCode: req.othersMemberCode,
      },
    });

    if (!exMember) {
      return {
        error: ERRORCODE.NET_E_NOT_EXIST_USER,
        errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_USER),
      };
    }

    const othersRoomList = await this.commonService.getMyRoomInfo(exMember.id);

    return {
      othersRoomList: othersRoomList,
      error: ERRORCODE.NET_E_SUCCESS,
      message: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
    };
  }

  async getOthersRoomList(othersMemberCode: string) {
    const exMember = await this.memberRepository.findOne({
      where: {
        memberCode: othersMemberCode,
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

    const othersRoomList = await this.commonService.getMyRoomInfo(exMember.id);
    // 마이룸 액자 정보
    const othersMyRoomFrameImages =
      await this.commonService.getMyRoomFrameImages(exMember.id);

    return {
      othersRoomList: othersRoomList,
      othersMyRoomFrameImages: othersMyRoomFrameImages,
      error: ERRORCODE.NET_E_SUCCESS,
      errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
    };
  }

  // 마이룸 만들기
  async createMyRoom(memberId: string, data: CreateMyRoomDto) {
    const member = await this.memberRepository.findOne({
      where: {
        id: memberId,
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

    // 업데이트 검증
    if (data.updateMyRoomDatas && data.updateMyRoomDatas.length > 0) {
      for (const item of data.updateMyRoomDatas) {
        const exItem = await this.dataSource
          .getRepository(MemberMyRoomInfo)
          .findOne({
            where: {
              memberId,
              itemId: item.itemId,
              num: item.num,
            },
          });

        if (!exItem) {
          // 마이룸에 없는 아이템
          console.log('마이룸에 없는 아이템. 업데이트 할 수 없음.');
          throw new HttpException({}, HttpStatus.FORBIDDEN);
        }
      }
    }

    // 생성 검증
    if (data.createMyRoomDatas && data.createMyRoomDatas.length > 0) {
      for (const item of data.createMyRoomDatas) {
        const inven = await this.dataSource
          .getRepository(MemberFurnitureItemInven)
          .findOne({
            where: {
              memberId,
              itemId: item.itemId,
              num: item.num,
            },
          });

        if (!inven) {
          // 인벤토리에 없는 아이템
          console.log('인벤토리에 없는 아이템. 생성 할 수 없음.');
          throw new HttpException({}, HttpStatus.FORBIDDEN);
        }

        const myroom = await this.dataSource
          .getRepository(MemberMyRoomInfo)
          .findOne({
            where: {
              memberId,
              itemId: item.itemId,
              num: item.num,
            },
          });

        if (myroom) {
          // 마이룸에 있는 아이템
          console.log('마이룸에 이미 있는아이템. 삭제 할 수 없음.');
          throw new HttpException(
            {
              error: ERRORCODE.NET_E_ALREADY_EXIST_MYROOM_ITEM,
              message: ERROR_MESSAGE(ERRORCODE.NET_E_ALREADY_EXIST_MYROOM_ITEM),
            },
            HttpStatus.FORBIDDEN,
          );
        }
      }
    }

    // 삭제 검증
    if (data.deleteMyRoomDatas && data.deleteMyRoomDatas.length > 0) {
      for (const item of data.deleteMyRoomDatas) {
        const installInfo = await this.dataSource
          .getRepository(InteriorInstallInfo)
          .findOne({
            where: {
              itemId: item.itemId,
            },
          });

        if (installInfo.removable === BOOLEAN.FALSE) {
          console.log('제거 할 수 없는 아이템. 삭제 할 수 없음.');
          throw new HttpException(
            {
              error: ERRORCODE.NET_E_CANNOT_DELETE_ITEM,
              message: ERROR_MESSAGE(ERRORCODE.NET_E_CANNOT_DELETE_ITEM),
            },
            HttpStatus.FORBIDDEN,
          );
        }

        const inven = await this.dataSource
          .getRepository(MemberFurnitureItemInven)
          .findOne({
            where: {
              memberId,
              itemId: item.itemId,
              num: item.num,
            },
          });

        if (!inven) {
          // 인벤토리에 없는 아이템
          console.log('인벤토리에 없는 아이템. 삭제 할 수 없음.');
          throw new HttpException(
            {
              error: ERRORCODE.NET_E_NOT_EXIST_FURNITURE_INVEN_ITEM,
              message: ERROR_MESSAGE(
                ERRORCODE.NET_E_NOT_EXIST_FURNITURE_INVEN_ITEM,
              ),
            },
            HttpStatus.FORBIDDEN,
          );
        }

        const myroom = await this.dataSource
          .getRepository(MemberMyRoomInfo)
          .findOne({
            where: {
              memberId,
              itemId: item.itemId,
              num: item.num,
            },
          });

        if (!myroom) {
          // 마이룸에 없는 아이템
          console.log('마이룸에 없는 아이템. 삭제 할 수 없음.');
          throw new HttpException(
            {
              error: ERRORCODE.NET_E_NOT_EXIST_MYROOM_ITEM,
              message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_MYROOM_ITEM),
            },
            HttpStatus.FORBIDDEN,
          );
        }
      }
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 생성
      if (data.createMyRoomDatas && data.createMyRoomDatas.length > 0) {
        for (const item of data.createMyRoomDatas) {
          const updateQuery = queryRunner.manager
            .createQueryBuilder()
            .insert()
            .into(MemberMyRoomInfo)
            .values({
              itemId: item.itemId,
              num: item.num,
              layerType: item.layerType,
              x: item.x,
              y: item.y,
              rotation: item.rotation,
              memberId,
            })
            .execute();
        }
      }

      // 업데이트
      if (data.updateMyRoomDatas && data.updateMyRoomDatas.length > 0) {
        for (const item of data.updateMyRoomDatas) {
          const updateQuery = queryRunner.manager
            .createQueryBuilder()
            .update(MemberMyRoomInfo)
            .set(item)
            .where('itemId = :itemId AND num = :num AND memberId = :memberId', {
              itemId: item.itemId,
              num: item.num,
              memberId,
            });

          await updateQuery.execute();
        }
      }

      // 삭제
      if (data.deleteMyRoomDatas && data.deleteMyRoomDatas.length > 0) {
        for (const item of data.deleteMyRoomDatas) {
          await queryRunner.manager
            .createQueryBuilder()
            .delete()
            .from(MemberMyRoomInfo)
            .where('itemId = :itemId AND num = :num AND memberId = :memberId', {
              itemId: item.itemId,
              num: item.num,
              memberId,
            })
            .execute();
        }
      }

      await queryRunner.commitTransaction();
      const myRoomInfos = await this.commonService.getMyRoomInfo(memberId);

      return {
        myRoomInfos,
        error: ERRORCODE.NET_E_SUCCESS,
        errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
      };
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
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

  async updateStateType(memberId: string, data: UpdateStateTypeDto) {
    const exMember = await this.memberRepository.findOne({
      where: {
        id: memberId,
      },
    });

    if (!exMember) {
      return {
        error: ERRORCODE.NET_E_NOT_EXIST_USER,
        errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_USER),
      };
    }

    const member = new Member();
    member.id = memberId;
    member.myRoomStateType = data.myRoomStateType;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.getRepository(Member).save(member);
      await queryRunner.commitTransaction();
      return {
        myRoomStateType: data.myRoomStateType,
        error: ERRORCODE.NET_E_SUCCESS,
        errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
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

  async uploadIFrameImage(
    memberId: string,
    data: UpdateFrameImageDto,
    file: Express.Multer.File,
  ) {
    const uploadType = Number(data.uploadType);
    const itemId = Number(data.itemId);
    const num = Number(data.num);

    const member = await this.memberRepository.findOne({
      where: {
        id: memberId,
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

    const item = await this.dataSource.getRepository(MemberMyRoomInfo).findOne({
      where: {
        memberId: memberId,
        itemId: itemId,
        num: num,
      },
    });

    if (!item) {
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_NOT_EXIST_MYROOM_ITEM,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_MYROOM_ITEM),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    // 이미지 Url 일 경우
    if (uploadType === UPLOAD_TYPE.IMAGE_URL && !data.imageUrl) {
      //이미지 url이 없습니다.
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_NOT_EXIST_IMAGE_URL,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_IMAGE_URL),
        },
        HttpStatus.FORBIDDEN,
      );
    }
    // 로컬이미지 일 경우
    if (uploadType === UPLOAD_TYPE.LOCAL_IMAGE && !file) {
      // 첨부 된 파일이 없습니다.
      throw new HttpException(
        {
          error: ERRORCODE.NET_E_NOT_EXIST_IMAGE_FILE,
          message: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_IMAGE_FILE),
        },
        HttpStatus.FORBIDDEN,
      );
    }

    const newFrameImage = new MemberFrameImage();
    newFrameImage.memberId = memberId;
    newFrameImage.itemId = itemId;
    newFrameImage.num = num;
    newFrameImage.uploadType = uploadType;

    if (uploadType === UPLOAD_TYPE.IMAGE_URL) {
      newFrameImage.imageName = data.imageUrl;
    } else if (uploadType === UPLOAD_TYPE.LOCAL_IMAGE) {
      const filename = decodeURIComponent(file.originalname);
      const timestamp = new Date().getTime();
      const fileNameArr = filename.split('.');
      const extName = fileNameArr[1];

      newFrameImage.imageName = `${timestamp}_${fileNameArr[0]}.${extName}`;
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager
        .getRepository(MemberFrameImage)
        .save(newFrameImage);

      await this.azureBlobService.deleteFolder(
        `frameImage/${member.memberCode}/${newFrameImage.num}`,
      );

      if (file) {
        file.originalname = decodeURIComponent(file.originalname);
        const path = `frameImage/${member.memberCode}/${newFrameImage.num}/${newFrameImage.imageName}`;
        await this.azureBlobService.upload(file, path);
      }

      await queryRunner.commitTransaction();
      const frameImages =
        await this.commonService.getMemberFrameImages(memberId);
      return {
        frameImages,
        error: ERRORCODE.NET_E_SUCCESS,
        errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
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

  // 액자 이미지 삭제
  async deleteFrameImage(memberId: string, itemString: string) {
    const items = JSON.parse(itemString);
    const member = await this.memberRepository.findOne({
      where: {
        id: memberId,
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

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const i of items) {
        const item = await this.dataSource
          .getRepository(MemberMyRoomInfo)
          .findOne({
            where: {
              memberId: memberId,
              itemId: i.itemId,
              num: i.num,
            },
          });

        if (!item) {
          return {
            error: ERRORCODE.NET_E_NOT_EXIST_MYROOM_ITEM,
            errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_NOT_EXIST_MYROOM_ITEM),
          };
        }

        await queryRunner.manager
          .getRepository(MemberFrameImage)
          .delete({ memberId: memberId, itemId: i.itemId, num: i.num });

        await this.azureBlobService.deleteFolder(
          `frameImage/${member.memberCode}/${i.num}`,
        );
      }

      const list = await queryRunner.manager
        .getRepository(MemberFrameImage)
        .find({
          where: {
            memberId: memberId,
          },
        });
      console.log(list);

      await queryRunner.commitTransaction();
      const frameImages =
        await this.commonService.getMemberFrameImages(memberId);
      return {
        frameImages,
        error: ERRORCODE.NET_E_SUCCESS,
        errorMessage: ERROR_MESSAGE(ERRORCODE.NET_E_SUCCESS),
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
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
}

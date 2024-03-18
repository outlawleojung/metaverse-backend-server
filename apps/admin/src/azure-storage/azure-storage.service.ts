import { Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import cheerio from 'cheerio';
import { GetBlobListDto } from './dto/req/get.blob.list.dto';
import { AzureBlobService } from '@libs/common';
import { HttpException } from '@nestjs/common/exceptions';
import { DeleteBlobDto } from './dto/req/delete.blob.dto';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AzureStorage,
  BannerReservation,
  ScreenReservation,
} from '@libs/entity';
import { ADMIN_PAGE, MEDIA_EXPOSURE_TYPE, SEARCH_TYPE } from '@libs/constants';
import { UploadStorageFileDTO } from './dto/req/upload.storage.file.dto';
@Injectable()
export class AzureStorageService {
  constructor(
    private azureBlobStorage: AzureBlobService,
    @Inject(DataSource) private readonly dataSource: DataSource,
    @InjectRepository(AzureStorage)
    private readonly azureStorageRepository: Repository<AzureStorage>,
  ) {}
  // Blob List 전체 가져오기
  async getBlobList() {
    const blobListArr: any = [];
    try {
      const response = await axios.get(
        `https://${process.env.AZURE_ACCOUNT}.blob.core.windows.net/${process.env.AZURE_CONTAINER}/arzmeta?restype=container&comp=list`,
      );

      const $ = cheerio.load(response.data);
      $('Blobs > Blob').each((i, elem) => {
        const blob = $(elem);
        blobListArr.push({
          fileName: blob.find('Name').text(),
          fileUploadAt: blob.find('Last-Modified').text(),
          fileSize: blob.find('Content-Length').text(),
          fileContentType: blob.find('Content-Type').text(),
        });
      });

      return blobListArr;
    } catch (error) {
      console.error(error);
      return [];
    }
  }
  // Blob List 폴더별로 가져오기
  async getBlobListFolder(data: GetBlobListDto) {
    const blobListArr: any = [];
    try {
      const response = await axios.get(
        `https://${process.env.AZURE_ACCOUNT}.blob.core.windows.net/${process.env.AZURE_CONTAINER}/arzmeta?restype=container&comp=list&prefix=${data}`,
      );

      const $ = cheerio.load(response.data);
      $('Blobs > Blob').each((i, elem) => {
        const blob = $(elem);
        blobListArr.push({
          fileName: blob.find('Name').text(),
          fileUploadAt: blob.find('Last-Modified').text(),
          fileSize: blob.find('Content-Length').text(),
          fileContentType: blob.find('Content-Type').text(),
        });
      });

      return blobListArr;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  // 스토리지 파일 가져오기
  async getAzureStorageFileList(data: GetBlobListDto) {
    const page = data?.page ?? 1;
    const limit = ADMIN_PAGE.LIST_PAGE_COUNT;
    const offset = 0 + (page - 1) * limit;
    const SerachType = data.searchType;

    const azureStorage = await this.dataSource
      .getRepository(AzureStorage)
      .createQueryBuilder('s')
      .select([
        's.id as id',
        's.fileName as fileName',
        's.fileSize as fileSize',
        's.imageSize as imageSize',
        's.videoPlayTime as videoPlayTime',
        's.uploadFolder as uploadFolder',
        's.fileContentType as fileContentType',
        's.createdAt as createdAt',
      ])
      .where('s.mediaExposureType = :mediaExposureType', {
        mediaExposureType: MEDIA_EXPOSURE_TYPE.ALL,
      })
      .orderBy('createdAt', 'DESC')
      .offset(offset)
      .limit(limit);

    if (SerachType != 'ALL') {
      azureStorage.andWhere('s.uploadFolder = :uploadFolder', {
        uploadFolder: SerachType,
      });
    }

    const rows = await azureStorage.getRawMany();
    const count = await azureStorage.getCount();

    const screenList = [];
    const bannerList = [];

    if (data.searchType == SEARCH_TYPE.ALL) {
      for (let i = 0; i < rows.length; i++) {
        const screendata = await this.dataSource
          .getRepository(ScreenReservation)
          .createQueryBuilder('sr')
          .select([
            'sr.id as id',
            'sr.screenId as screenId',
            'sr.screenContentType as screenContentType',
            'sr.contents as contents',
            'sr.description as description',
            'sr.adminId as adminId',
            'sr.startedAt as startedAt',
            'sr.endedAt as endedAt',
            'sr.createdAt as createdAt',
            'sr.updatedAt as updatedAt',
          ])
          .innerJoin('sr.ScreenInfo', 'si')
          .where('sr.contents like :data', { data: `%${rows[i].fileName}%` })
          .andWhere('si.mediaExposureType = :mediaExposureType', {
            mediaExposureType: MEDIA_EXPOSURE_TYPE.ALL,
          })
          .andWhere('sr.endedAt > now()')
          .getRawMany();

        if (screendata && screendata.length > 0) {
          screenList.push(screendata);
        }

        const bannerdata = await this.dataSource
          .getRepository(BannerReservation)
          .createQueryBuilder('br')
          .select([
            'br.id as id',
            'br.bannerId as bannerId',
            'br.uploadType as uploadType',
            'br.contents as contents',
            'br.description as description',
            'br.adminId as adminId',
            'br.startedAt as startedAt',
            'br.endedAt as endedAt',
            'br.createdAt as createdAt',
            'br.updatedAt as updatedAt',
          ])
          .innerJoin('br.BannerInfo', 'bi')
          .where('br.contents like :data', { data: `%${rows[i].fileName}%` })
          .andWhere('bi.mediaExposureType = :mediaExposureType', {
            mediaExposureType: MEDIA_EXPOSURE_TYPE.ALL,
          })
          .andWhere('br.endedAt > now()')
          .getRawMany();

        if (bannerdata && bannerdata.length > 0) {
          bannerList.push(bannerdata);
        }
      }

      return { rows, count, screenList, bannerList };
    }

    if (data.searchType == SEARCH_TYPE.SCREEN) {
      // 사용 여부 검사를 위한
      for (let i = 0; i < rows.length; i++) {
        const screendata = await this.dataSource
          .getRepository(ScreenReservation)
          .createQueryBuilder('sr')
          .select([
            'sr.id as id',
            'sr.screenId as screenId',
            'sr.screenContentType as screenContentType',
            'sr.contents as contents',
            'sr.description as description',
            'sr.adminId as adminId',
            'sr.startedAt as startedAt',
            'sr.endedAt as endedAt',
            'sr.createdAt as createdAt',
            'sr.updatedAt as updatedAt',
          ])
          .innerJoin('sr.ScreenInfo', 'si')
          .where('sr.contents like :data', { data: `%${rows[i].fileName}%` })
          .andWhere('si.mediaExposureType = :mediaExposureType', {
            mediaExposureType: MEDIA_EXPOSURE_TYPE.ALL,
          })
          .andWhere('sr.endedAt > now()')
          .getRawMany();

        if (screendata && screendata.length > 0) {
          screenList.push(screendata);
        }
      }
      return { rows, count, screenList };
    }

    if (data.searchType == SEARCH_TYPE.BANNER) {
      for (let i = 0; i < rows.length; i++) {
        const bannerdata = await this.dataSource
          .getRepository(BannerReservation)
          .createQueryBuilder('br')
          .select([
            'br.id as id',
            'br.bannerId as bannerId',
            'br.uploadType as uploadType',
            'br.contents as contents',
            'br.description as description',
            'br.adminId as adminId',
            'br.startedAt as startedAt',
            'br.endedAt as endedAt',
            'br.createdAt as createdAt',
            'br.updatedAt as updatedAt',
          ])
          .innerJoin('br.BannerInfo', 'bi')
          .where('br.contents like :data', { data: `%${rows[i].fileName}%` })
          .andWhere('bi.mediaExposureType = :mediaExposureType', {
            mediaExposureType: MEDIA_EXPOSURE_TYPE.ALL,
          })
          .andWhere('br.endedAt > now()')
          .getRawMany();

        if (bannerdata && bannerdata.length > 0) {
          bannerList.push(bannerdata);
        }
      }
      return { rows, count, bannerList };
    }

    return { rows, count };
  }

  // 스토리지 파일 업로드
  async getBlobUpload(file: Express.Multer.File, data: UploadStorageFileDTO) {
    if (file) {
      let folderName;

      if (file.mimetype.includes('image')) {
        folderName = 'banner';
      }

      if (file.mimetype.includes('video')) {
        folderName = 'screen';
      }

      if (folderName == undefined) {
        throw new HttpException('알 수 없는 파일 형식 입니다.', 500);
      }

      const dateNow = Date.now();

      const path = `${folderName}/arzmeta/${
        data.fileName.substring(0, data.fileName.lastIndexOf('.')) +
        '_' +
        dateNow +
        '.' +
        data.fileName.substring(data.fileName.lastIndexOf('.') + 1)
      }`;

      await this.azureBlobStorage.upload(file, path);

      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        const azureStorageFile = new AzureStorage();
        // azureStorageFile.fileName = data.fileName + '_' + dateNow;
        azureStorageFile.fileName =
          'arzmeta/' +
          data.fileName.substring(0, data.fileName.lastIndexOf('.')) +
          '_' +
          dateNow +
          '.' +
          data.fileName.substring(data.fileName.lastIndexOf('.') + 1);
        azureStorageFile.fileSize = file.size.toString();
        azureStorageFile.imageSize = data?.imageSize;
        azureStorageFile.videoPlayTime = data?.videoPlayTime;
        azureStorageFile.fileContentType = file.mimetype;
        azureStorageFile.uploadFolder = folderName;
        azureStorageFile.mediaExposureType = MEDIA_EXPOSURE_TYPE.ALL;

        await queryRunner.manager
          .getRepository(AzureStorage)
          .save(azureStorageFile);
        await queryRunner.commitTransaction();

        return true;
      } catch (error) {
        console.log(error);
        await queryRunner.rollbackTransaction();
        return false;
      } finally {
        await queryRunner.release();
      }
    } else {
      throw new HttpException('파일이 존재하지 않습니다.', 500);
    }
  }

  // 스토리지 파일 삭제
  async getBlobDelete(file: DeleteBlobDto) {
    if (!file) {
      throw new HttpException('데이터가 존재하지 않습니다.', 500);
    }

    for (let i = 0; i < file.fileId.length; i++) {
      const fileName = await this.dataSource
        .getRepository(AzureStorage)
        .findOne({
          where: {
            id: file.fileId[i],
            mediaExposureType: MEDIA_EXPOSURE_TYPE.ALL,
          },
        });

      if (fileName) {
        const path = `${fileName.uploadFolder}/${fileName.fileName}`;
        await this.azureBlobStorage.deletefile(path);
        await this.azureStorageRepository.delete({ id: file.fileId[i] });
      } else {
        throw new HttpException('데이터가 존재하지 않습니다.', 500);
      }
    }
    return true;
  }
}

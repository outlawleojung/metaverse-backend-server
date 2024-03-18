import { ApiProperty } from '@nestjs/swagger';
import { GetTableDto } from '../../../common/dto/get.table.dto';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class GetBlobListResponseDto {
  @ApiProperty({
    description: '파일 목록',
    example: [
      {
        id: 18,
        fileName: 'Doraemon.png',
        fileSize: '29172',
        uploadFolder: 'banner',
        fileContentType: 'image/png',
        createdAt: '2023-08-18T08:16:14.000Z',
      },
      {
        id: 19,
        fileName: 'Doraemon.png',
        fileSize: '29172',
        uploadFolder: 'banner',
        fileContentType: 'image/png',
        createdAt: '2023-08-18T08:16:14.000Z',
      },
      {
        id: 17,
        fileName: 'Doraemon.png',
        fileSize: '29172',
        uploadFolder: 'banner',
        fileContentType: 'image/png',
        createdAt: '2023-08-18T08:16:13.000Z',
      },
    ],
  })
  public readonly rows: string;

  @ApiProperty({
    description: '개수 ',
    example: 3,
  })
  public readonly count: number;

  @ApiProperty({
    description: '스토리지 파일을 사용하고 있는 스크린 예약 목록',
    example: [
      {
        id: 8,
        screenId: 30001,
        screenContentType: 1,
        contents: '["KTMF_Fullversion_102s.mp4","Doraemon.mp4"]',
        description: 'KTMF 102초 영상',
        adminId: 23,
        startedAt: '2023-08-01T15:00:00.000Z',
        endedAt: '2023-12-31T14:59:59.000Z',
        createdAt: '2023-07-18T05:57:10.000Z',
        updatedAt: '2023-08-21T00:41:27.000Z',
      },
    ],
  })
  public readonly screenList: string;

  @ApiProperty({
    description: '스토리지 파일을 사용하고 있는 배너 예약 목록',
    example: [
      {
        id: 66,
        bannerId: 211001,
        uploadType: 1,
        contents: 'Doraemon.png',
        description: '99',
        adminId: 23,
        startedAt: '2023-07-07T04:33:00.000Z',
        endedAt: '2023-07-07T07:14:45.000Z',
        createdAt: '2023-07-07T04:32:33.000Z',
        updatedAt: '2023-08-21T00:41:49.000Z',
      },
      {
        id: 66,
        bannerId: 211001,
        uploadType: 1,
        contents: 'Doraemon.png',
        description: '99',
        adminId: 23,
        startedAt: '2023-07-07T04:33:00.000Z',
        endedAt: '2023-07-07T07:14:45.000Z',
        createdAt: '2023-07-07T04:32:33.000Z',
        updatedAt: '2023-08-21T00:41:49.000Z',
      },
      {
        id: 66,
        bannerId: 211001,
        uploadType: 1,
        contents: 'Doraemon.png',
        description: '99',
        adminId: 23,
        startedAt: '2023-07-07T04:33:00.000Z',
        endedAt: '2023-07-07T07:14:45.000Z',
        createdAt: '2023-07-07T04:32:33.000Z',
        updatedAt: '2023-08-21T00:41:49.000Z',
      },
    ],
  })
  public readonly bannerList: string;
}

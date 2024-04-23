import { AzureBlobService, CommonService } from '@libs/common';
import { REPORT_STATE_TYPE } from '@libs/constants';
import {
  Member,
  MemberReportInfo,
  ReportCategory,
  ReportReasonType,
  ReportType,
} from '@libs/entity';
import {
  Injectable,
  Inject,
  Logger,
  ForbiddenException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateReportDto } from './dto/create.report.dto';
import dayjs from 'dayjs';

@Injectable()
export class ReportService {
  constructor(
    private azureBlobService: AzureBlobService,
    @InjectRepository(MemberReportInfo)
    private readonly memberReportInfoRepository: Repository<MemberReportInfo>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    private readonly commonService: CommonService,
    @Inject(DataSource) private dataSource: DataSource,
  ) {}
  private readonly logger = new Logger(ReportService.name);

  // 신고하기
  async createReport(
    files: Array<Express.Multer.File>,
    memberId: string,
    nickname: string,
    data: CreateReportDto,
  ) {
    const member = await this.memberRepository.findOne({
      where: {
        id: memberId,
      },
    });

    console.log('신고자 확인', member);
    if (!member) {
      throw new ForbiddenException('존재 하지 않는 사용자');
    }

    const targetMember = await this.memberRepository.findOne({
      where: {
        memberCode: data.targetMemberCode,
      },
    });

    console.log('신고대상 확인', targetMember);
    if (!targetMember) {
      throw new ForbiddenException('존재 하지 않는 사용자');
    }

    if (files.length > 3) {
      throw new ForbiddenException('이미지 파일은 3개까지 유효 합니다.');
    }

    const newReport = new MemberReportInfo();
    newReport.targetMemberId = targetMember.id;
    newReport.targetNickname = targetMember.nickname;
    newReport.reportMemberId = memberId;
    newReport.reportNickname = nickname;
    newReport.content = data.content;
    newReport.reportType = data.reportType;
    newReport.reasonType = data.reasonType;
    newReport.reportedAt = new Date(data.reportedAt);
    newReport.stateType = REPORT_STATE_TYPE.RECEIPT;

    console.log('###################### report ##################');
    console.log(newReport);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.getRepository(MemberReportInfo).save(newReport);
      // 이미지 파일 처리
      console.log(files);
      if (files.length > 0) {
        const imageArr = [];
        for (const image of files) {
          const imageName = this.commonService.getImageName(image.originalname);
          const path = `report/${newReport.id}/${imageName}`;

          await this.azureBlobService.upload(image, path);

          imageArr.push(imageName);
        }
        const patchReport = new MemberReportInfo();
        patchReport.id = newReport.id;
        patchReport.images = JSON.stringify(imageArr);
        await queryRunner.manager
          .getRepository(MemberReportInfo)
          .save(patchReport);
      }

      await queryRunner.commitTransaction();
      return HttpStatus.OK;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new ForbiddenException('DB 에러');
    } finally {
      await queryRunner.release();
    }
  }

  // 신고 관련 상수 조회
  async getConstant() {
    const reportCategory = await this.dataSource
      .getRepository(ReportCategory)
      .find();
    const reportType = await this.dataSource.getRepository(ReportType).find();
    const reasonType = await this.dataSource
      .getRepository(ReportReasonType)
      .find();

    return { reportCategory, reportType, reasonType };
  }
}

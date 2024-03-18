import { LicenseGroupInfo, LicenseInfo } from '@libs/entity';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, QueryRunner } from 'typeorm';
import couponCode from 'coupon-code';

@Injectable()
export class CommonService {
  constructor(
    @InjectRepository(LicenseInfo)
    private licenseInfoRepository: Repository<LicenseInfo>,
    @InjectRepository(LicenseGroupInfo)
    @Inject(DataSource)
    private dataSource: DataSource,
  ) {}
  private readonly logger = new Logger(CommonService.name);

  async generateLicense(
    count: number,
    groupId: number,
    quryRunner: QueryRunner,
  ) {
    let isGenerate = true;
    let num = 0;
    while (isGenerate) {
      const generator = couponCode.generate();

      const license = await this.licenseInfoRepository.findOne({
        where: {
          licenseSerial: generator,
        },
      });

      if (!license) {
        const newLicense = new LicenseInfo();
        newLicense.groupId = groupId;
        newLicense.licenseSerial = generator;

        await quryRunner.manager.getRepository(LicenseInfo).save(newLicense);
        num++;
      }

      if (num >= count) {
        isGenerate = false;
      }
    }
  }
}

import { BaseModelEntity, LicenseGroupInfo, LicenseInfo } from '@libs/entity';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  Repository,
  QueryRunner,
  FindManyOptions,
  FindOptionsWhere,
  FindOptionsOrder,
} from 'typeorm';
import couponCode from 'coupon-code';
import { BasePaginationDto } from './dto/base-pagination.dto';
import { FILTER_MAPPER } from './filter-mapper.const';

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

  async paginate<T extends BaseModelEntity>(
    dto: BasePaginationDto,
    repository: Repository<T>,
    overrideFindOptions: FindManyOptions<T> = {},
    path: string,
  ) {
    if (dto.page) {
      return await this.pagePaginate(dto, repository, overrideFindOptions);
    } else {
      return await this.cursorPaginate(
        dto,
        repository,
        overrideFindOptions,
        path,
      );
    }
  }

  private async pagePaginate<T extends BaseModelEntity>(
    dto: BasePaginationDto,
    repository: Repository<T>,
    overrideFindOptions: FindManyOptions<T> = {},
  ) {
    const findOptions = this.composeFindOptions<T>(dto);

    const [data, count] = await repository.findAndCount({
      ...findOptions,
      ...overrideFindOptions,
    });

    return {
      data,
      total: count,
    };
  }

  private async cursorPaginate<T extends BaseModelEntity>(
    dto: BasePaginationDto,
    repository: Repository<T>,
    overrideFindOptions: FindManyOptions<T> = {},
    path: string,
  ) {
    const findOptions = this.composeFindOptions<T>(dto);

    const results = await repository.find({
      ...findOptions,
      ...overrideFindOptions,
    });

    const lastItem =
      results.length > 0 && results.length === dto.take
        ? results[results.length - 1]
        : null;

    const nextUrl =
      lastItem && new URL(`${process.env.ADMIN_URL}/api/${path}/test`);

    if (nextUrl) {
      for (const key of Object.keys(dto)) {
        if (dto[key]) {
          if (
            key !== 'where__id__more_than' &&
            key !== 'where__id__less_than'
          ) {
            nextUrl.searchParams.append(key, dto[key].toString());
          }
        }
      }

      let key = null;

      if (dto.order__createdAt === 'ASC') {
        key = 'where__id__more_than';
      } else {
        key = 'where__id__less_than';
      }

      nextUrl.searchParams.append(key, lastItem.id.toString());
    }

    return {
      data: results,
      cursor: {
        after: lastItem?.id ?? null,
      },
      count: results.length,
      next: nextUrl?.toString() ?? null,
    };
  }

  private composeFindOptions<T extends BaseModelEntity>(
    dto: BasePaginationDto,
  ): FindManyOptions<T> {
    let where: FindOptionsWhere<T> = {};
    let order: FindOptionsOrder<T> = {};

    for (const [key, value] of Object.entries(dto)) {
      if (key.startsWith('where__')) {
        where = {
          ...where,
          ...this.parseWhereFilter(key, value),
        };
      } else if (key.startsWith('order__')) {
        order = {
          ...order,
          ...this.parseWhereFilter(key, value),
        };
      }
    }

    return {
      where,
      order,
      take: dto.take,
      skip: dto.page ? dto.take * (dto.page - 1) : null,
    };
  }

  private parseWhereFilter<T extends BaseModelEntity>(
    key: string,
    value: any,
  ): FindOptionsWhere<T> {
    const options: FindOptionsWhere<T> = {};

    const split = key.split('__');

    if (split.length !== 2 && split.length !== 3) {
      throw new BadRequestException(
        `where 필터는 '__'로 split 했을 때 길이가 2 또는 3이어야 한다. - error key : ${key}`,
      );
    }

    if (split.length === 2) {
      const [_, field] = split;
      options[field] = value;
    } else {
      const [_, field, operator] = split;

      const values = value.toString().split(',');

      if (operator === 'between') {
        options[field] = FILTER_MAPPER[operator](values[0], values[1]);
      } else {
        options[field] = FILTER_MAPPER[operator](value);
      }
    }

    return options;
  }
}

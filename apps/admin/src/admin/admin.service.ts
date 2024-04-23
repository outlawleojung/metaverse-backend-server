import {
  Injectable,
  Inject,
  UnauthorizedException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  FindOptionsWhere,
  LessThan,
  MoreThan,
  Repository,
} from 'typeorm';
import { AdminType, RoleType, Admin } from '@libs/entity';
import { GetTableDto } from '../common/dto/get.table.dto';
import { ROLE_TYPE } from '@libs/constants';
import { EndedUnixTimestamp, StartedUnixTimestamp } from '@libs/common';
import { ForbiddenException } from '@nestjs/common/exceptions';
import { ChangeRoleTypeDto } from './dto/request/changeroletype.dto';
import { PaginateAdminDto } from './dto/request/paginate-admin.dto';
import { CommonService } from '../common/common.service';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);
  constructor(
    @InjectRepository(Admin) private adminRepository: Repository<Admin>,
    @InjectRepository(RoleType)
    private roleTypeRepository: Repository<RoleType>,
    private readonly commonService: CommonService,
    @Inject(DataSource) private dataSource: DataSource,
  ) {}

  async paginateAdmins(dto: PaginateAdminDto) {
    // if (dto.page) {
    //   return this.pagePaginateAdmins(dto);
    // } else {
    //   return this.cursorPaginateAdmins(dto);
    // }
    return await this.commonService.paginate(
      dto,
      this.adminRepository,
      {},
      'admin',
    );
  }

  async pagePaginateAdmins(dto: PaginateAdminDto) {
    const skip = dto.take * (dto.page - 1);
    const [admins, count] = await this.adminRepository.findAndCount({
      order: {
        createdAt: dto.order__createdAt,
      },
      relations: { AdminType: true, RoleType: true },
      take: dto.take,
      skip: skip,
    });

    return { data: admins, total: count };
  }

  async cursorPaginateAdmins(dto: PaginateAdminDto) {
    const where: FindOptionsWhere<Admin> = {};

    if (dto.where__id__less_than) {
      where.id = LessThan(dto.where__id__less_than);
    } else if (dto.where__id__more_than) {
      where.id = MoreThan(dto.where__id__more_than);
    }

    const admins = await this.adminRepository.find({
      where,
      order: {
        createdAt: dto.order__createdAt,
      },
      take: dto.take,
    });

    const lastItem =
      admins.length > 0 && admins.length === dto.take
        ? admins[admins.length - 1]
        : null;

    const nextUrl =
      lastItem && new URL(`${process.env.ADMIN_URL}/api/admin/test`);

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
      data: admins,
      cursor: {
        after: lastItem?.id ?? null,
      },
      count: admins.length,
      nextUrl,
    };
  }

  // 관리자 상수 조회
  async getConstants() {
    const adminType = await this.dataSource.getRepository(AdminType).find();
    console.log(adminType);
    return { adminType };
  }

  // 관리자 목록 조회
  async getAdminList(myId: number, data: GetTableDto) {
    const limit = 10;
    const offset = 0 + (data.page - 1) * limit;
    const searchType = data.searchType;
    const searchValue = data.searchValue;
    const searchValueArr = String(data.searchValue).split('|');
    let startedAt = new Date();
    let endedAt = new Date();
    try {
      const adminList = await this.dataSource
        .getRepository(Admin)
        .createQueryBuilder('user')
        .select([
          'admin.id',
          'admin.email',
          'admin.roleType',
          'admin.adminType',
          'adminType.name',
          'admin.name',
          'admin.department',
          'admin.company',
          'admin.phoneNumber',
          'admin.loginedAt',
        ])
        .innerJoinAndSelect('admin.RoleType', 'roleType')
        .leftJoin('admin.AdminType', 'adminType')
        .where(`admin.roleType > :roleType`, {
          roleType: ROLE_TYPE.SYSTEM_ADMIN,
        })
        .offset(offset)
        .limit(limit);

      const adminCount = await this.dataSource
        .getRepository(Admin)
        .createQueryBuilder('admin')
        .where(`admin.roleType > :roleType`, {
          roleType: ROLE_TYPE.SYSTEM_ADMIN,
        });
      switch (searchType) {
        case 'EMAIL':
          adminList.andWhere('admin.email like :email', {
            email: `%${searchValue}%`,
          });
          adminCount.andWhere('admin.email like :email', {
            email: `%${searchValue}%`,
          });
          break;
        case 'NAME':
          adminList.andWhere('admin.name like :name', {
            name: `%${searchValue}%`,
          });
          adminCount.andWhere('admin.name like :name', {
            name: `%${searchValue}%`,
          });
          break;
        case 'PHONENUMBER':
          adminList.andWhere('admin.phoneNumber like :phoneNumber', {
            phoneNumber: `%${searchValue}%`,
          });
          adminCount.andWhere('admin.phoneNumber like :phoneNumber', {
            phoneNumber: `%${searchValue}%`,
          });
          break;
        case 'ROLE_TYPE':
          adminList.andWhere('admin.roleType = :searchValue', {
            searchValue,
          });
          adminCount.andWhere('admin.roleType = :searchValue', {
            searchValue,
          });
          break;
        case 'CREATED_AT':
          startedAt = new Date(StartedUnixTimestamp(Number(searchValueArr[0])));
          endedAt = new Date(EndedUnixTimestamp(Number(searchValueArr[1])));

          adminList.andWhere('admin.createdAt <= :endedAt', { endedAt });
          adminList.andWhere('admin.createdAt >= :startedAt', { startedAt });

          adminCount.andWhere('admin.createdAt <= :endedAt', { endedAt });
          adminCount.andWhere('admin.createdAt >= :startedAt', {
            startedAt,
          });
          break;
        case 'ADMIN_TYPE':
          adminList.andWhere('admin.adminType = :searchValue', {
            searchValue: Number(searchValue),
          });
          adminCount.andWhere('admin.adminType = :searchValue', {
            searchValue: Number(searchValue),
          });
          break;
        default:
          break;
      }
      const rows = await adminList.getMany();
      const count = await adminCount.getCount();
      return { rows, count };
    } catch (error) {
      console.log(error);
      throw new ForbiddenException('에러가 발생했습니다.');
    }
  }

  // 관리자 역할 타입 목록 조회
  async getRoleTypeList(myId: number) {
    if (myId) {
      try {
        const admin = await this.dataSource.getRepository(Admin).findOne({
          where: {
            id: myId,
          },
        });

        if (!admin) {
          throw new UnauthorizedException('사용자를 찾을 수 없습니다');
        }

        let roleTypes = null;
        if (admin.roleType > ROLE_TYPE.SYSTEM_ADMIN) {
          roleTypes = await this.dataSource
            .getRepository(RoleType)
            .createQueryBuilder('role_type')
            .select(['roleType.type', 'roleType.name'])
            .where(`roleType.type > :roleType `, { roleType: admin.roleType })
            .getMany();
        } else {
          roleTypes = await this.dataSource
            .getRepository(RoleType)
            .createQueryBuilder('role_type')
            .select(['roleType.type', 'roleType.name'])
            .where(`roleType.type > :roleType`, {
              roleType: ROLE_TYPE.SYSTEM_ADMIN,
            })
            .getMany();
        }

        return roleTypes;
      } catch (e) {
        this.logger.error({ e });
        throw new ForbiddenException();
      }
    } else {
      throw new UnauthorizedException('권한이 없습니다.');
    }
  }

  // 관리자 역할 타입 조회
  async searchRoleType(myId: number) {
    if (myId) {
      try {
        const admin = await this.dataSource.getRepository(Admin).findOne({
          where: {
            id: myId,
          },
        });

        if (!admin) {
          throw new UnauthorizedException('사용자를 찾을 수 없습니다');
        }

        const roleTypes = await this.dataSource
          .getRepository(RoleType)
          .createQueryBuilder('role_type')
          .where(`role_type.type >= :roleType`, {
            roleType: ROLE_TYPE.SUPER_ADMIN,
          })
          .getMany();

        return roleTypes;
      } catch (e) {
        this.logger.error({ e });
        throw new ForbiddenException();
      }
    } else {
      throw new UnauthorizedException('권한이 없습니다.');
    }
  }

  // 관리자 역할 변경 하기
  async changeRoleType(myId: number, data: ChangeRoleTypeDto) {
    //roletype
    // body에 userId

    const roleType = data.roleType;

    if (myId) {
      const admin = await this.adminRepository.findOne({
        where: {
          id: myId,
        },
      });

      if (admin) {
        // 일반 관리자 이상의 권한이 있어야 수정이 가능 하다.
        if (admin.roleType > ROLE_TYPE.NORMAL_ADMIN) {
          throw new UnauthorizedException('권한이 없습니다.');
        }

        // 일반 관리자는 슈퍼 관리자의 권한을 수정 할 수 없다.
        if (
          admin.roleType >= ROLE_TYPE.NORMAL_ADMIN &&
          admin.roleType <= ROLE_TYPE.SUPER_ADMIN
        ) {
          throw new UnauthorizedException('권한이 없습니다.');
        }

        // 일반 관리자는 슈퍼 관리자 이상의 권한을 줄 수 없다.
        if (
          admin.roleType >= ROLE_TYPE.NORMAL_ADMIN &&
          roleType <= ROLE_TYPE.SUPER_ADMIN
        ) {
          throw new UnauthorizedException('권한이 없습니다.');
        }
      } else {
        throw new BadRequestException('잘못된 요청입니다.');
      }
    }
    const admin = await this.dataSource
      .getRepository(Admin)
      .createQueryBuilder('admin')
      .select([
        'admin.id',
        'admin.email',
        'admin.roleType',
        'admin.name',
        'admin.department',
        'admin.company',
        'admin.phoneNumber',
        'admin.loginedAt',
      ])
      .innerJoinAndSelect('admin.RoleType', 'roleType')
      .where({
        id: data.userId,
      })
      .getOne();

    if (admin) {
      const newAdmin = new Admin();
      newAdmin.id = admin.id;
      newAdmin.roleType = data.roleType;

      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        await queryRunner.manager.getRepository(Admin).save(newAdmin);
        await queryRunner.commitTransaction();
      } catch (error) {
        this.logger.error({ error });
        await queryRunner.rollbackTransaction();
      } finally {
        await queryRunner.release();
      }
      const Role_Type = await this.dataSource.getRepository(RoleType).findOne({
        where: {
          type: roleType,
        },
      });

      if (Role_Type) {
        const result = await this.dataSource
          .getRepository(Admin)
          .createQueryBuilder('admin')
          .select([
            'admin.id',
            'admin.email',
            'admin.roleType',
            'admin.name',
            'admin.department',
            'admin.company',
            'admin.phoneNumber',
            'admin.loginedAt',
          ])
          .innerJoinAndSelect('admin.RoleType', 'roleType')
          .where({
            id: data.userId,
          });
        return { id: data.userId, roleType: Role_Type };
      }
    } else {
      throw new UnauthorizedException('존재하지 않는 관리자 입니다.');
    }
  }
}

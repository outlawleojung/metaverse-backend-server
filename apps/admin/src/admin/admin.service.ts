import {
  Injectable,
  Inject,
  UnauthorizedException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { AdminType, RoleType, User } from '@libs/entity';
import { GetTableDto } from '../common/dto/get.table.dto';
import { ROLE_TYPE } from '@libs/constants';
import { EndedUnixTimestamp, StartedUnixTimestamp } from '@libs/common';
import { ForbiddenException } from '@nestjs/common/exceptions';
import { ChangeRoleTypeDto } from './dto/request/changeroletype.dto';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(RoleType)
    private roleTypeRepository: Repository<RoleType>,
    @Inject(DataSource) private dataSource: DataSource,
  ) {}

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
        .getRepository(User)
        .createQueryBuilder('user')
        .select([
          'user.id',
          'user.email',
          'user.roleType',
          'user.adminType',
          'adminType.name',
          'user.name',
          'user.department',
          'user.company',
          'user.phoneNumber',
          'user.loginedAt',
        ])
        .innerJoinAndSelect('user.RoleType', 'roleType')
        .leftJoin('user.AdminType', 'adminType')
        .where(`user.roleType > :roleType`, {
          roleType: ROLE_TYPE.SYSTEM_ADMIN,
        })
        .offset(offset)
        .limit(limit);

      const adminCount = await this.dataSource
        .getRepository(User)
        .createQueryBuilder('user')
        .where(`user.roleType > :roleType`, {
          roleType: ROLE_TYPE.SYSTEM_ADMIN,
        });
      switch (searchType) {
        case 'EMAIL':
          adminList.andWhere('user.email like :email', {
            email: `%${searchValue}%`,
          });
          adminCount.andWhere('user.email like :email', {
            email: `%${searchValue}%`,
          });
          break;
        case 'NAME':
          adminList.andWhere('user.name like :name', {
            name: `%${searchValue}%`,
          });
          adminCount.andWhere('user.name like :name', {
            name: `%${searchValue}%`,
          });
          break;
        case 'PHONENUMBER':
          adminList.andWhere('user.phoneNumber like :phoneNumber', {
            phoneNumber: `%${searchValue}%`,
          });
          adminCount.andWhere('user.phoneNumber like :phoneNumber', {
            phoneNumber: `%${searchValue}%`,
          });
          break;
        case 'ROLE_TYPE':
          adminList.andWhere('user.roleType = :searchValue', {
            searchValue,
          });
          adminCount.andWhere('user.roleType = :searchValue', {
            searchValue,
          });
          break;
        case 'CREATED_AT':
          startedAt = new Date(StartedUnixTimestamp(Number(searchValueArr[0])));
          endedAt = new Date(EndedUnixTimestamp(Number(searchValueArr[1])));

          adminList.andWhere('user.createdAt <= :endedAt', { endedAt });
          adminList.andWhere('user.createdAt >= :startedAt', { startedAt });

          adminCount.andWhere('user.createdAt <= :endedAt', { endedAt });
          adminCount.andWhere('user.createdAt >= :startedAt', {
            startedAt,
          });
          break;
        case 'ADMIN_TYPE':
          adminList.andWhere('user.adminType = :searchValue', {
            searchValue: Number(searchValue),
          });
          adminCount.andWhere('user.adminType = :searchValue', {
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
        const user = await this.dataSource.getRepository(User).findOne({
          where: {
            id: myId,
          },
        });

        if (!user) {
          throw new UnauthorizedException('사용자를 찾을 수 없습니다');
        }

        let roleTypes = null;
        if (user.roleType > ROLE_TYPE.SYSTEM_ADMIN) {
          roleTypes = await this.dataSource
            .getRepository(RoleType)
            .createQueryBuilder('role_type')
            .select(['roleType.type', 'roleType.name'])
            .where(`roleType.type > :roleType `, { roleType: user.roleType })
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
        const user = await this.dataSource.getRepository(User).findOne({
          where: {
            id: myId,
          },
        });

        if (!user) {
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
      const admin = await this.userRepository.findOne({
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
    const user = await this.dataSource
      .getRepository(User)
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.email',
        'user.roleType',
        'user.name',
        'user.department',
        'user.company',
        'user.phoneNumber',
        'user.loginedAt',
      ])
      .innerJoinAndSelect('user.RoleType', 'roleType')
      .where({
        id: data.userId,
      })
      .getOne();

    if (user) {
      const newUser = new User();
      newUser.id = user.id;
      newUser.roleType = data.roleType;

      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        await queryRunner.manager.getRepository(User).save(newUser);
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
          .getRepository(User)
          .createQueryBuilder('user')
          .select([
            'user.id',
            'user.email',
            'user.roleType',
            'user.name',
            'user.department',
            'user.company',
            'user.phoneNumber',
            'user.loginedAt',
          ])
          .innerJoinAndSelect('user.RoleType', 'roleType')
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

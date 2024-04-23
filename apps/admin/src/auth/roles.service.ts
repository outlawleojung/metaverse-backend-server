import { ADMIN_TYPE, ROLE_TYPE } from '@libs/constants';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from '@libs/entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Admin) private adminRepository: Repository<Admin>,
  ) {}
  private readonly logger = new Logger(RolesService.name);

  async matchRoles(roles: number[], admin: Admin) {
    const currentAdmin = await this.adminRepository.findOne({
      where: {
        id: admin.id,
        adminType: ADMIN_TYPE.ARZMETA_ADMIN,
      },
    });

    if (currentAdmin.roleType === ROLE_TYPE.SYSTEM_ADMIN) {
      return true;
    }

    if (currentAdmin.roleType === ROLE_TYPE.UNAUTHORIZED) {
      this.logger.debug('미인증 관리자 입니다.');
      throw new UnauthorizedException({
        message: {
          error: 402,
          message: '미인증 관리자 입니다.',
        },
      });
    }

    const highestRole = Math.min(...roles);

    if (currentAdmin.roleType <= highestRole) {
      return true;
    }

    if (roles.length === 0 && currentAdmin.roleType !== ROLE_TYPE.UNAUTHORIZED)
      return true;

    throw new UnauthorizedException({
      message: {
        error: 401,
        message: '권한이 없습니다.',
      },
    });
  }
}

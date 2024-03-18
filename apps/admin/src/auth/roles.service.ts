import { ADMIN_TYPE, ROLE_TYPE } from '@libs/constants';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@libs/entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}
  private readonly logger = new Logger(RolesService.name);

  async matchRoles(roles: number[], user: User) {
    const currentUser = await this.usersRepository.findOne({
      where: {
        id: user.id,
        adminType: ADMIN_TYPE.ARZMETA_ADMIN,
      },
    });

    if (currentUser.roleType === ROLE_TYPE.SYSTEM_ADMIN) {
      return true;
    }

    if (currentUser.roleType === ROLE_TYPE.UNAUTHORIZED) {
      this.logger.debug('미인증 관리자 입니다.');
      throw new UnauthorizedException({
        message: {
          error: 402,
          message: '미인증 관리자 입니다.',
        },
      });
    }

    const highestRole = Math.min(...roles);

    if (currentUser.roleType <= highestRole) {
      return true;
    }

    if (roles.length === 0 && currentUser.roleType !== ROLE_TYPE.UNAUTHORIZED)
      return true;

    throw new UnauthorizedException({
      message: {
        error: 401,
        message: '권한이 없습니다.',
      },
    });
  }
}

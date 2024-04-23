import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import bcryptjs from 'bcryptjs';
import { Repository } from 'typeorm';
import { Admin } from '@libs/entity';
import { ADMIN_TYPE } from '@libs/constants';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Admin) private adminRepository: Repository<Admin>,
  ) {}
  private readonly logger = new Logger(AuthService.name);

  async validateUser(email: string, password: string) {
    const user = await this.adminRepository.findOne({
      where: { email: email, adminType: ADMIN_TYPE.ARZMETA_ADMIN },
      select: { id: true, email: true, password: true },
    });

    this.logger.debug(email, password, user);

    if (!user) {
      return null;
    }
    const result = await bcryptjs.compare(password, user.password);
    if (result) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  }
}

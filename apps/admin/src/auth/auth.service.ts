import { Injectable, Inject, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import bcryptjs from 'bcryptjs';
import { DataSource, Repository } from 'typeorm';
import { User } from '@libs/entity';
import { ADMIN_TYPE } from '@libs/constants';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @Inject(DataSource) private dataSource: DataSource,
  ) {}
  private readonly logger = new Logger(AuthService.name);

  async validateUser(email: string, password: string) {
    const user = await this.dataSource.getRepository(User).findOne({
      where: { email: email, adminType: ADMIN_TYPE.ARZMETA_ADMIN },
      select: ['id', 'email', 'password'],
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

import { Injectable, Logger } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from '@libs/entity';
import { AuthService } from './auth.service';

@Injectable()
export class LocalSerializer extends PassportSerializer {
  private readonly logger = new Logger(LocalSerializer.name);
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(Admin) private adminRepository: Repository<Admin>,
  ) {
    super();
  }

  serializeUser(admin: Admin, done: CallableFunction) {
    this.logger.debug(admin);
    done(null, admin.id);
  }

  async deserializeUser(adminId: number, done: CallableFunction) {
    return await this.adminRepository
      .findOneOrFail({
        where: { id: adminId },
        select: { id: true, email: true, name: true, roleType: true },
        relations: { RoleType: true },
      })
      .then((admin) => {
        done(null, admin);
      })
      .catch((error) => done(error));
  }
}

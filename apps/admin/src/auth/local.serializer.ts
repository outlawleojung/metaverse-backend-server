import { Injectable, Logger } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@libs/entity';
import { AuthService } from './auth.service';

@Injectable()
export class LocalSerializer extends PassportSerializer {
  private readonly logger = new Logger(LocalSerializer.name);
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {
    super();
  }

  serializeUser(user: User, done: CallableFunction) {
    this.logger.debug(user);
    done(null, user.id);
  }

  async deserializeUser(userId: number, done: CallableFunction) {
    return await this.userRepository
      .findOneOrFail({
        where: { id: userId },
        select: ['id', 'email', 'name', 'roleType'],
        relations: ['RoleType'],
      })
      .then((user) => {
        done(null, user);
      })
      .catch((error) => done(error));
  }
}

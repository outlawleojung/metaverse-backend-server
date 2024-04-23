import {
  Inject,
  Injectable,
  ForbiddenException,
  Logger,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import bcryptjs from 'bcryptjs';
import { Admin } from '@libs/entity';
import { JoinRequestDto } from './dto/join.request.dto';
import { ADMIN_TYPE, ROLE_TYPE } from '@libs/constants';
import { ForgetPasswordDto } from './dto/forget.password.dto';
import { ChangePasswordDto } from './dto/change.password.dto';
import { EmailOptions, MailService } from '../mail/mail.service';
import { ChangeAdminInfoDto } from './dto/change.admin.info.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    private mailService: MailService,
    @Inject(DataSource) private dataSource,
  ) {}

  async createAdmin(data: JoinRequestDto) {
    const admin = new Admin();
    admin.email = data.email;
    admin.name = data.name;
    admin.password = await bcryptjs.hashSync(data.password, 12);
    admin.company = data.company;
    admin.department = data.department;
    admin.phoneNumber = data.phoneNumber;
    admin.roleType = ROLE_TYPE.UNAUTHORIZED;
    admin.adminType = ADMIN_TYPE.ARZMETA_ADMIN;
    admin.loginedAt = new Date();

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.getRepository(Admin).save(admin);
      await queryRunner.commitTransaction();
      return HttpStatus.OK;
    } catch (error) {
      this.logger.log(error);
      await queryRunner.rollbackTransaction();
      throw new ForbiddenException('DB 실패!!');
    } finally {
      await queryRunner.release();
    }
  }

  async getDetailInfo(adminId: number) {
    const admin = await this.adminRepository.findOne({
      where: {
        id: adminId,
      },
    });

    const { password, ...newAdmin } = admin;
    console.log(newAdmin);
    return newAdmin;
  }

  async forgetPassword(data: ForgetPasswordDto) {
    const admin = await this.adminRepository.findOne({
      where: {
        name: data.name,
        email: data.email,
      },
    });

    if (!admin) {
      throw new ForbiddenException('사용자를 찾을 수 없습니다.');
    }

    const password = Math.random().toString(36).substr(2, 8);
    const hashedPassword = await bcryptjs.hash(password, 12);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newAdmin = new Admin();
      newAdmin.id = admin.id;
      newAdmin.password = hashedPassword;

      await queryRunner.manager.getRepository(Admin).save(newAdmin);

      // 이메일 발송
      const emailOptions: EmailOptions = {
        to: admin.email,
        subject: '[a:rzmeta] 패스워드 재설정 이메일',
        html: 'passwordReset',
        text: '패스워드 재설정 이메일 입니다.',
      };

      const context = {
        password: password,
        remainTime: Number(process.env.MAIL_REMAIN_MINIUTE),
      };
      this.mailService.sendEmail(emailOptions, context);

      await queryRunner.commitTransaction();
      return HttpStatus.OK;
    } catch (error) {
      this.logger.log(error);
      await queryRunner.rollbackTransaction();
      throw new ForbiddenException('DB 실패!!');
    } finally {
      await queryRunner.release();
    }
  }

  async changeAdminInfo(adminId: number, data: ChangeAdminInfoDto) {
    // 사용자 존재 여부 확인
    const exUser = await this.adminRepository.findOne({
      where: { id: adminId },
    });

    if (!exUser) {
      throw new ForbiddenException('존재하지 않는 사용자');
    }

    const newAdmin = new Admin();
    newAdmin.id = adminId;

    Object.assign(newAdmin, data);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.getRepository(Admin).save(newAdmin);
      await queryRunner.commitTransaction();

      return HttpStatus.OK;
    } catch (error) {
      this.logger.log(error);
      await queryRunner.rollbackTransaction();
      throw new ForbiddenException('DB 실패!!');
    } finally {
      await queryRunner.release();
    }
  }

  async changePassword(adminId: number, data: ChangePasswordDto) {
    // 사용자 존재 여부 확인
    const exUser = await this.adminRepository.findOne({
      where: { id: adminId },
    });

    if (!exUser) {
      throw new ForbiddenException('존재하지 않는 사용자');
    }

    // 기존 패스워드 검증
    const password = data.password;
    const validPassword = await bcryptjs.compareSync(
      password,
      exUser.password!,
    );

    if (!validPassword) {
      this.logger.error('패스워드 불일치');
      throw new BadRequestException('패스워드 불일치');
    }

    // 새패스워드
    const newHashedpassword = await bcryptjs.hash(data.newPassword, 12);

    if (newHashedpassword === exUser.password) {
      throw new BadRequestException('기존 패스워드와 동일한 패스워드 입니다.');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.update(
        Admin,
        { id: adminId },

        {
          password: newHashedpassword,
        },
      );

      await queryRunner.commitTransaction();

      return HttpStatus.OK;
    } catch (error) {
      this.logger.log(error);
      await queryRunner.rollbackTransaction();
      throw new ForbiddenException('DB 실패!!');
    } finally {
      await queryRunner.release();
    }
  }

  async checkDuplicateEmail(email: string) {
    if (!this.checkEmail(email)) {
      throw new ForbiddenException('이메일 형식이 아닙니다.');
    }
    const admin = await this.adminRepository.findOne({
      where: {
        email: email,
      },
    });

    if (admin) {
      throw new ForbiddenException('이미 가입된 이메일 입니다.');
    }

    return HttpStatus.OK;
  }

  async getTest() {
    return this.adminRepository
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.RoleType', 'roleType')
      .getMany();
  }

  checkEmail(email: string) {
    const reg =
      /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

    return reg.test(email);
  }
}

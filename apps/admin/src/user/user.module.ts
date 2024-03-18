import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, EntityModule } from '@libs/entity';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), EntityModule, MailModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}

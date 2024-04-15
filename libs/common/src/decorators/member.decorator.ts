import { Member } from '@libs/entity';
import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const MemberDeco = createParamDecorator(
  (data: keyof Member | undefined, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();

    const member = req.member as Member;

    if (!member) {
      throw new InternalServerErrorException();
    }

    if (data) {
      return member[data];
    }

    return null;
  },
);

import { Injectable } from '@nestjs/common';

@Injectable()
export class PassAuthService {
  getHello(): string {
    return 'Hello World!';
  }
}

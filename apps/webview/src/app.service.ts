import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `${process.env.BRANCH_NAME} MOASIS WEBVIEW BACKEND SERVER !`;
  }
}
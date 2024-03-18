import { SignOptions } from 'jsonwebtoken';
import { config } from 'dotenv';

config();;

const secretKey: string = process.env.SECRET_KEY;
const options: SignOptions = {
  algorithm: 'HS256', // 해싱 알고리즘
  expiresIn: '100d', // 토큰 유효 기간
  subject: process.env.SECRET_KEY,
};
export { secretKey, options };

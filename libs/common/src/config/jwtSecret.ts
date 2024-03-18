import { SignOptions } from 'jsonwebtoken';

const secretKey: string = process.env.SECRET_KEY;
const options: SignOptions = {
  algorithm: 'HS256', // 해싱 알고리즘
  expiresIn: '30h', // 토큰 유효 기간
};
export { secretKey, options };

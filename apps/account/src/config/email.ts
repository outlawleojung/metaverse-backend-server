import { config } from 'dotenv';

config();

/*
  EMAIL_AUTH_EMAIL: 메일서버의 이메일
  EMAIL_AUTH_PASSWORD: 메일서버 패스워드
  EMAIL_HOST: 메일서버
  EMAIL_FROM_USER_NAME: 보내는 사람 이름
*/
export default () => ({
  email: {
    // transport: `smtps://${process.env.MAIL_ID}:${process.env.MAIL_PASSWORD}@${process.env.MAIL_HOST}`,
    // defaults: {
    //   from: `"${process.env.MAIL_FROM_USER_NAME}" <${process.env.MAIL_ID}>`,
    // },
    transport: {
      host: 'smtp.gmail.com',
      port: '465',
      secure: true,
      auth: {
        user: process.env.MAIL_ID,
        pass: process.env.MAIL_PASSWORD,
      },
    },
  },
});

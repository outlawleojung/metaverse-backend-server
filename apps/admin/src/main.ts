import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';
import { HttpExceptionFilter } from './httpException.filter';
import expressBasicAuth from 'express-basic-auth';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
declare const module: any;

async function bootstrap() {
  const prod: boolean = process.env.NODE_ENV === 'production';
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(
    ['/docs', '/docs-json'],
    expressBasicAuth({
      challenge: true,
      users: { [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('[moasis] 관리자페이지 API')
    .setDescription('[moasis] 관리자페이지 개발을 위한 API 문서')
    .addCookieAuth('connect.sid')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(cookieParser());

  const NANO_SEC_IN_A_DAY = 86400000;
  const maxAge = 0.2 * NANO_SEC_IN_A_DAY;

  app.use(
    session({
      resave: false,
      saveUninitialized: false,
      secret: process.env.COOKIE_SECRET,
      cookie: {
        maxAge: maxAge,
        httpOnly: true,
        secure: false,
        domain: prod ? process.env.DOMAIN : undefined,
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(
    cors({
      origin: process.env.ADMIN_FRONT_URL,
      credentials: true,
    }),
  );

  app.setBaseViewsDir(join(__dirname, '..', 'src', 'views'));

  const port = process.env.ADMIN_SERVER || 3730;
  await app.listen(port);

  console.info(
    `Admin application started on port : ${port} - ${process.env.NODE_ENV}`,
  );

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();

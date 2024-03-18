import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import session from 'express-session';
import cors from 'cors';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import expressBasicAuth from 'express-basic-auth';

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
    .setTitle('[a:zrmeta] 유니티 웹뷰 API')
    .setDescription('[a:zrmeta] 유니티 개발을 위한 API 문서')
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

  app.use(cookieParser());

  const NANO_SEC_IN_A_DAY = 86400000;
  const maxAge = 1 * NANO_SEC_IN_A_DAY;

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
      origin: process.env.UNITY_PAGE_URL,
      credentials: true,
    }),
  );

  app.setBaseViewsDir(join(__dirname, '..', 'src', 'views'));

  const port = process.env.HOMEPAGE_BACKEND_SERVER || 3895;
  await app.listen(port);
  console.info(`Express application started on port : ${port}`);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();

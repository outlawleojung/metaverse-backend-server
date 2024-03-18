import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ManagerModule } from './manager/manager.module';
import { AppClusterService } from './cluster/app-cluster.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import expressBasicAuth from 'express-basic-auth';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(ManagerModule);

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');
  app.enableCors();

  app.use(
    ['/docs', '/docs-json'],
    expressBasicAuth({
      challenge: true,
      users: { [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('[moasis] 소켓 서버 API')
    .setDescription('[moasis] 소켓서버 개발을 위한 API 문서')
    .addCookieAuth('connect.sid')
    .setVersion('1.0.0')
    .build();

  app.use(helmet());

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.SOCKET_PORT);

  console.log(`Application is running on: ${await app.getUrl()}`);
}
// bootstrap();
AppClusterService.clusterize(bootstrap);

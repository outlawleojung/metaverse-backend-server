import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(helmet());

  const PORT = process.env.HUB_SERVER || 3930;
  await app.listen(PORT);
  console.log(`Hub Server Is Running On: ${PORT}`);
}
bootstrap();

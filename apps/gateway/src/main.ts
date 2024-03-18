import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './httpException.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter());

  const port = process.env.GATEWAY_SERVER || 4080;
  await app.listen(port);
  console.info(`Gateway application started on port : ${port}`);
}
bootstrap();

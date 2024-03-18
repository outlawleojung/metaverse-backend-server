import { Module } from '@nestjs/common';
import { PassService } from './pass/pass.service';
import { PassModule } from './pass/pass.module';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    PassModule,
  ],
  controllers: [AppController],
  providers: [AppService, PassService],
})
export class AppModule {}

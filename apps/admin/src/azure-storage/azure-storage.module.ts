import { Module } from '@nestjs/common';
import { AzureStorageService } from './azure-storage.service';
import { AzureStorageController } from './azure-storage.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AzureStorage, User } from '@libs/entity';
import { AzureBlobService } from '@libs/common';
import { DataSource } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User, AzureStorage, DataSource])],
  providers: [AzureStorageService, AzureBlobService],
  controllers: [AzureStorageController],
})
export class AzureStorageModule {}

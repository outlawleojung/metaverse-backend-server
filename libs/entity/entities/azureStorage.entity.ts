import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MediaExposureType } from './mediaExposureType.entity';

@Entity('azure_storage')
export class AzureStorage {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'mediaExposureType' })
  mediaExposureType: number;

  @Column('varchar', { name: 'fileName', length: 100 })
  fileName: string;

  @Column('varchar', { name: 'fileSize', length: 100 })
  fileSize: string;

  @Column('varchar', { name: 'imageSize', length: 100 })
  imageSize: string;

  @Column('varchar', { name: 'videoPlayTime', length: 100 })
  videoPlayTime: string;

  @Column('varchar', { name: 'fileContentType', length: 100 })
  fileContentType: string;

  @Column('varchar', { name: 'uploadFolder', length: 100 })
  uploadFolder: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => MediaExposureType, (type) => type.AzureStorages, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'mediaExposureType', referencedColumnName: 'type' }])
  MediaExposureType: MediaExposureType;
}

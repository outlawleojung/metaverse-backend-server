import { Entity, OneToMany } from 'typeorm';
import { BoothFileBoxInfo } from './boothFileBoxInfo.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('file_box_type')
export class FileBoxType extends BaseTypeEntity {
  @OneToMany(() => BoothFileBoxInfo, (info) => info.FileBoxType)
  BoothFileBoxInfos: BoothFileBoxInfo[];
}

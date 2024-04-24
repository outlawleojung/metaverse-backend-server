import { BaseTypeEntity } from './baseTypeEntity.entity';
import { OnfContentsInfo } from './onfContentsInfo.entity';
import { Entity, OneToMany } from 'typeorm';

@Entity('onf_contents_type')
export class OnfContentsType extends BaseTypeEntity {
  @OneToMany(
    () => OnfContentsInfo,
    (onfContentsInfo) => onfContentsInfo.OnfContentsType,
  )
  OnfContentsInfos: OnfContentsInfo[];
}

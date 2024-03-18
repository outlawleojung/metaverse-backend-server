import { Column, Entity, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { OnfContentsType } from './onfContentsType.entity';

@Entity('onf_contents_info')
export class OnfContentsInfo {
  @PrimaryColumn('int', { name: 'onfContentsType' })
  onfContentsType: number;

  @Column('int', { name: 'isOn' })
  isOn: number;

  @ManyToOne(() => OnfContentsType, (onfContentsType) => onfContentsType.OnfContentsInfos, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'onfContentsType', referencedColumnName: 'type' }])
  OnfContentsType: OnfContentsType;
}

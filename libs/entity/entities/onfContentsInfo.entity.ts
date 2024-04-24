import { Column, Entity, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { OnfContentsType } from './onfContentsType.entity';

@Entity('onf_contents_info')
export class OnfContentsInfo {
  @PrimaryColumn('int')
  onfContentsType: number;

  @Column('int')
  isOn: number;

  @ManyToOne(
    () => OnfContentsType,
    (onfContentsType) => onfContentsType.OnfContentsInfos,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'onfContentsType' })
  OnfContentsType: OnfContentsType;
}

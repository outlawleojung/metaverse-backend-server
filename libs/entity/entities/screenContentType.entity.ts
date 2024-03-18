import { Entity, OneToMany } from 'typeorm';
import { ScreenReservation } from './screenReservation.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('screen_content_type')
export class ScreenContentType extends BaseTypeEntity {
  @OneToMany(() => ScreenReservation, (param) => param.ScreenContentType)
  ScreenReservations: ScreenReservation[];
}

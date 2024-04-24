import { OfficeGradeAuthority } from './officeGradeAuthority.entity';
import { Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { OfficeProductItem } from './officeProductItem.entity';
import { Localization } from './localization.entity';
import { Member } from './member.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Index('name', ['name'], {})
@Entity('office_grade_type')
export class OfficeGradeType extends BaseTypeEntity {
  @OneToMany(() => Member, (member) => member.OfficeGradeType)
  Members: Member[];

  @OneToMany(
    () => OfficeGradeAuthority,
    (authority) => authority.OfficeGradeType,
  )
  OfficeGradeAuthorities: OfficeGradeAuthority[];

  @OneToMany(
    () => OfficeProductItem,
    (officeproductitem) => officeproductitem.OfficeGradeType,
  )
  OfficeProductItems: OfficeProductItem[];

  @ManyToOne(
    () => Localization,
    (localization) => localization.OfficeGradeTypes,
    {
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'name' })
  LocalizationName: Localization;
}

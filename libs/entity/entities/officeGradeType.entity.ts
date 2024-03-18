import { OfficeGradeAuthority } from './officeGradeAuthority.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Member } from './member.entity';
import { ApiProperty } from '@nestjs/swagger';
import { OfficeProductItem } from './officeProductItem.entity';
import { Localization } from './localization.entity';

@Index('name', ['name'], {})
@Entity('office_grade_type')
export class OfficeGradeType {
  @ApiProperty({
    example: 1,
    description: '오피스 등급 타입',
  })
  @Column('int', { primary: true, name: 'type' })
  type: number;

  @ApiProperty({
    example: '일반',
    description: '타입 이름',
  })
  @Column('varchar', { name: 'name', length: 64 })
  name: string;

  @OneToMany(() => Member, (member) => member.OfficeGradeType)
  Members: Member[];

  @OneToMany(() => OfficeGradeAuthority, (authority) => authority.OfficeGradeType)
  OfficeGradeAuthorities: OfficeGradeAuthority[];

  @OneToMany(() => OfficeProductItem, (officeproductitem) => officeproductitem.OfficeGradeType)
  OfficeProductItems: OfficeProductItem[];

  @ManyToOne(() => Localization, (localization) => localization.OfficeGradeTypes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'name', referencedColumnName: 'id' }])
  LocalizationName: Localization;
}

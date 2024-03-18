import { Entity, OneToMany } from 'typeorm';
import { DisciplineReview } from './disciplineReview.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('restriction_type')
export class RestrictionType extends BaseTypeEntity {
  @OneToMany(() => DisciplineReview, (review) => review.RestrictionType)
  DisciplineReviews: DisciplineReview[];
}

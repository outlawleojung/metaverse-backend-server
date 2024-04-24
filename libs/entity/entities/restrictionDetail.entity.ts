import { Entity, OneToMany } from 'typeorm';
import { DisciplineReview } from './disciplineReview.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('restriction_detail')
export class RestrictionDetail extends BaseTypeEntity {
  @OneToMany(() => DisciplineReview, (review) => review.RestrictionDetail)
  DisciplineReviews: DisciplineReview[];
}

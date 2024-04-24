import { Entity, OneToMany } from 'typeorm';
import { DisciplineReview } from './disciplineReview.entity';
import { BaseTypeEntity } from './baseTypeEntity.entity';

@Entity('discipline_detail')
export class DisciplineDetail extends BaseTypeEntity {
  @OneToMany(() => DisciplineReview, (review) => review.DisciplineDetail)
  DisciplineReviews: DisciplineReview[];
}

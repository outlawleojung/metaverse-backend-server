import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { DisciplineReview } from './disciplineReview.entity';

@Entity('discipline_detail')
export class DisciplineDetail {
  @PrimaryColumn('int', { name: 'type' })
  type: number;

  @Column('varchar', { name: 'name', length: 32 })
  name: string;

  @OneToMany(() => DisciplineReview, (review) => review.DisciplineDetail)
  DisciplineReviews: DisciplineReview[];
}

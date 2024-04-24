import { DisciplineDetail } from './disciplineDetail.entity';
import { RestrictionDetail } from './restrictionDetail.entity';
import { RestrictionType } from './restrictionType.entity';
import { Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Index('restrictionDetail', ['restrictionDetail'], {})
@Index('disciplineDetail', ['disciplineDetail'], {})
@Entity('discipline_review')
export class DisciplineReview {
  @PrimaryColumn('int')
  restrictionType: number;

  @PrimaryColumn('int')
  restrictionDetail: number;

  @PrimaryColumn('int')
  disciplineDetail: number;

  @ManyToOne(() => RestrictionType, (type) => type.DisciplineReviews, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'restrictionType' })
  RestrictionType: RestrictionType;

  @ManyToOne(() => RestrictionDetail, (type) => type.DisciplineReviews, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'restrictionDetail' })
  RestrictionDetail: RestrictionDetail;

  @ManyToOne(() => DisciplineDetail, (type) => type.DisciplineReviews, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'disciplineDetail' })
  DisciplineDetail: DisciplineDetail;
}

import { DisciplineDetail } from './disciplineDetail.entity';
import { RestrictionDetail } from './restrictionDetail.entity';
import { RestrictionType } from './restrictionType.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Index('restrictionDetail', ['restrictionDetail'], {})
@Index('disciplineDetail', ['disciplineDetail'], {})
@Entity('discipline_review')
export class DisciplineReview {
  @PrimaryColumn('int', { name: 'restrictionType' })
  restrictionType: number;

  @PrimaryColumn('int', { name: 'restrictionDetail' })
  restrictionDetail: number;

  @PrimaryColumn('int', { name: 'disciplineDetail' })
  disciplineDetail: number;

  @ManyToOne(() => RestrictionType, (type) => type.DisciplineReviews, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'restrictionType', referencedColumnName: 'type' }])
  RestrictionType: RestrictionType;

  @ManyToOne(() => RestrictionDetail, (type) => type.DisciplineReviews, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'restrictionDetail', referencedColumnName: 'type' }])
  RestrictionDetail: RestrictionDetail;

  @ManyToOne(() => DisciplineDetail, (type) => type.DisciplineReviews, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'disciplineDetail', referencedColumnName: 'type' }])
  DisciplineDetail: DisciplineDetail;
}

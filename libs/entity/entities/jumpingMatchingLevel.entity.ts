import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Index('gameType', ['gameType'], {})
@Entity('jumping_matching_level')
export class JumpingMatchingLevel {
  @PrimaryColumn('int')
  id: number;

  @Column('int')
  tileToHintInt: number;

  @Column('int')
  hintInt: number;

  @Column('int')
  quizeToDesInt: number;

  @Column('int')
  desToFinInt: number;

  @Column('int')
  nextRoundInt: number;

  @Column('int')
  showQuizeSec: number;

  @Column('int')
  gameType: number;

  @Column('int')
  spawnPaintCount: number;

  @Column('int')
  paintCount: number;

  @Column('varchar', { length: 256 })
  hintLevel: string;
}

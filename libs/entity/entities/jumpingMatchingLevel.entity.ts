import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Index('gameType', ['gameType'], {})
@Entity('jumping_matching_level')
export class JumpingMatchingLevel {
  @PrimaryColumn('int', { name: 'id' })
  id: number;

  @Column('int', { name: 'tileToHintInt' })
  tileToHintInt: number;

  @Column('int', { name: 'hintInt' })
  hintInt: number;

  @Column('int', { name: 'quizeToDesInt' })
  quizeToDesInt: number;

  @Column('int', { name: 'desToFinInt' })
  desToFinInt: number;

  @Column('int', { name: 'nextRoundInt' })
  nextRoundInt: number;

  @Column('int', { name: 'showQuizeSec' })
  showQuizeSec: number;

  @Column('int', { name: 'gameType' })
  gameType: number;

  @Column('int', { name: 'spawnPaintCount' })
  spawnPaintCount: number;

  @Column('int', { name: 'paintCount' })
  paintCount: number;

  @Column('varchar', { name: 'hintLevel', length: 256 })
  hintLevel: string;
}

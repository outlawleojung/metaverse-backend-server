import { JumpingMatchingLevel } from '@libs/entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export enum GameState {
  Idle,
  Playing,
}

export enum RoundState {
  Idle,
  Start,
  Tile,
  Hint,
  Problem,
  Destroy,
  Award,
  Finish,
}

@Injectable()
export class GameData {
  levelRepository: Repository<JumpingMatchingLevel>;
  gameState: GameState;
  roundState: RoundState;

  gen: number;
  roundTotal: number;
  roundCount: number;

  hintTotal: number;
  hintCount: number;

  firstRoundInterval: number = 11000; //게임 시작 후 첫 라운드 시작까지의 시간
  tileToHintInterval: number = 500; //타일 정보 전송 후 첫 힌트 제시까지의 시간
  hintToHintInterval: number; //힌트와 힌트 사이의 시간
  quizToDestroyInterval: number;
  destroyToFinishInterval: number; //문제 제시 후 라운드 종료까지의 시간
  toNextRoundInterval: number; //라운드 종료 후 다음 라운드 시작까지의 시간
  showQuizTime: number;
  awardingTime: number = 15000;

  tileNumber: number = 16;
  pictureNumber: number = 20;

  isSoloplay: boolean = false;

  hintToHintIntervals: number[] = [];
  quizToDestroyIntervals: number[] = [];
  destroyToFinishIntervals: number[] = [];
  toNextRoundIntervals: number[] = [];
  showQuizTimes: number[] = [];

  // pair<int, int>는 TypeScript에서는 객체 형태로 표현합니다.
  paintConditions: { first: number; second: number }[] = [];

  // 3차원 배열은 같은 방식으로 선언합니다.
  hintTemplates: boolean[][][] = [];

  // pair<int, string>도 객체 형태로 표현합니다.
  paints: { first: number; second: string }[] = [];

  pictureNames: string[] = [];
  players: string[] = [];

  constructor(repository: Repository<JumpingMatchingLevel>) {
    this.levelRepository = repository;
    this.gameState = GameState.Idle;
    this.roundCount = 0;
    this.roundState = RoundState.Idle;
    this.isSoloplay = false;
    this.gen = this.getRandomInt(1, 100);
  }

  async init(): Promise<boolean> {
    this.hintToHintIntervals = [];
    this.quizToDestroyIntervals = [];
    this.destroyToFinishIntervals = [];
    this.toNextRoundIntervals = [];
    this.showQuizTimes = [];

    this.paintConditions = [];
    this.hintTemplates = [];

    const gameLevels = await this.levelRepository.find();

    gameLevels.forEach((level) => {
      this.hintToHintIntervals.push(level.hintInt);
      this.quizToDestroyIntervals.push(level.quizeToDesInt);
      this.destroyToFinishIntervals.push(level.desToFinInt);
      this.toNextRoundIntervals.push(level.nextRoundInt);
      this.showQuizTimes.push(level.showQuizeSec);

      const paintNumber = level.spawnPaintCount;
      this.paintConditions.push({
        first: paintNumber,
        second: level.paintCount,
      });

      const hintTemplateString: string = level.hintLevel;
      const hintTemplatesForRound: boolean[][] = this.parseHintTemplateString(
        hintTemplateString,
        paintNumber,
      );

      this.hintTemplates.push(hintTemplatesForRound);
    });

    this.roundTotal = this.hintTemplates.length;

    for (let i = 1; i <= this.pictureNumber; i++)
      this.pictureNames.push(i.toString());

    return true;
  }

  private parseHintTemplateString(
    hintTemplateString: string,
    paintNumber: number,
  ): boolean[][] {
    const hintTemplatesForRound: boolean[][] = [];
    for (let i = 0; i < hintTemplateString.length; i += paintNumber) {
      const hintTemplate: boolean[] = Array.from(
        hintTemplateString.slice(i, i + paintNumber),
      ).map((char) => char === '1');
      hintTemplatesForRound.push(hintTemplate);
    }
    return hintTemplatesForRound;
  }

  clear() {
    this.gameState = GameState.Idle;

    this.roundCount = 0;
    this.roundState = RoundState.Idle;

    this.players = [];
    this.isSoloplay = false;
  }

  setRound() {
    this.hintToHintInterval = this.hintToHintIntervals[this.roundCount];
    this.quizToDestroyInterval = this.quizToDestroyIntervals[this.roundCount];
    this.destroyToFinishInterval =
      this.destroyToFinishIntervals[this.roundCount];
    this.toNextRoundInterval = this.toNextRoundIntervals[this.roundCount];
    this.showQuizTime = this.showQuizTimes[this.roundCount];

    this.makePaints();

    this.hintTotal = this.hintTemplates[this.roundCount].length;
    this.hintCount = 0;
  }

  makePaints() {
    // pictures 배열을 무작위로 섞는 부분
    const pictures = [...this.pictureNames]; // 기존 pictureNames 배열 복사
    pictures.sort(() => Math.random() - 0.5); // pictures 배열 무작위로 섞기

    // randomTiles 배열 생성 및 섞기 부분
    const randomTiles: number[] = Array.from(
      { length: this.tileNumber },
      (_, index) => index,
    );
    randomTiles.sort(() => Math.random() - 0.5); // randomTiles 배열 무작위로 섞기

    // paints 배열 초기화
    this.paints = [];

    // paintNumber와 pictureNumber 구하기
    const paintNumber = this.paintConditions[this.roundCount].first;
    const pictureNumber = this.paintConditions[this.roundCount].second;

    // paints에 데이터 추가하는 부분
    for (let i = 0; i < paintNumber; i++) {
      const pictureIndex = i % pictureNumber;
      this.paints.push({
        first: randomTiles[i],
        second: pictures[pictureIndex],
      });
    }
  }

  getTiles(): string[] {
    // 모든 타일을 "X"로 초기화
    const tiles: string[] = Array(this.tileNumber).fill('X');

    // paints 배열에 저장된 타일 정보로 tiles 배열 업데이트
    for (const paint of this.paints) {
      tiles[paint.first] = paint.second;
    }

    return tiles;
  }

  getHints(): boolean[] {
    // 모든 힌트를 false로 초기화
    const hints: boolean[] = Array(this.tileNumber).fill(false);

    // 현재 라운드와 힌트 카운트에 따른 힌트 템플릿 가져오기
    const hintTemplate = this.hintTemplates[this.roundCount][this.hintCount];

    // hintTemplate에 따라 특정 타일의 힌트를 true로 설정
    for (let i = 0; i < hintTemplate.length; i++) {
      if (hintTemplate[i]) {
        hints[this.paints[i].first] = true;
      }
    }

    return hints;
  }

  getProblem(): string {
    // 현재 라운드에 따른 문제의 조건을 결정
    const { second: pictureNumber } = this.paintConditions[this.roundCount];

    // 0부터 pictureNumber - 1까지의 범위에서 무작위 인덱스 생성
    const index = Math.floor(Math.random() * pictureNumber);

    // 선택된 인덱스에 해당하는 이미지 이름을 반환
    return this.paints[index].second;
  }

  getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { GameData } from './game-data';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';
import { InjectRepository } from '@nestjs/typeorm';
import { JumpingMatchingLevel } from '@libs/entity';
import { Repository } from 'typeorm';

@Injectable()
export class GameDataService {
  private logger = new Logger(GameDataService.name);
  private gameDatas: Map<string, GameData> = new Map();

  constructor(
    @InjectRedis() private readonly redisClient: Redis,
    @InjectRepository(JumpingMatchingLevel)
    private readonly levelRepository: Repository<JumpingMatchingLevel>,
  ) {}

  async initGameData(roomId: string) {
    const gameData = new GameData(this.levelRepository);

    this.gameDatas.set(roomId, gameData);
  }

  async getGameData(roomId: string) {
    return this.gameDatas.get(roomId);
  }
}

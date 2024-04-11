import { Injectable } from '@nestjs/common';
import { GameData } from '../game/game-data';

@Injectable()
export class MatchingRoomService {
  constructor(private readonly gameData: GameData) {}
  async getGameDataTiles() {
    await this.gameData.init();
    this.gameData.makePaints();
    return await this.gameData.getTiles();
  }
}

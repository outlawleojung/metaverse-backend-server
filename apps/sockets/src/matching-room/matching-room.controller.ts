import { Controller, Get } from '@nestjs/common';
import { MatchingRoomService } from './matching-room.service';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('api/matching-room')
export class MatchingRoomController {
  constructor(private readonly matchingRoomService: MatchingRoomService) {}

  @ApiExcludeEndpoint()
  @Get('game-data-tiles')
  async getGameDataTiles() {
    const tiles = await this.matchingRoomService.getGameDataTiles();

    console.log(tiles);

    return tiles;
  }
}

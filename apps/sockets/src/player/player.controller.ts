import { Body, Controller, Post } from '@nestjs/common';
import { PlayerService } from './player.service';

@Controller('api/player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Post('rooms')
  async login(@Body('clientId') clientId: string) {}
}

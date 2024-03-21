import { Room } from '../room/room';

export class GameRoom extends Room {
  startGame() {
    // 게임 시작 로직
    this.broadcast('gameStarted', {});
  }

  endGame() {
    // 게임 종료 로직
    this.broadcast('gameEnded', {});
  }

  join(clientId: string) {}
  leave(clientId: string) {}
  broadcast(event: string, data: any) {}
}

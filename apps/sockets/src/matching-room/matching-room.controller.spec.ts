import { Test, TestingModule } from '@nestjs/testing';
import { MatchingRoomController } from './matching-room.controller';
import { MatchingRoomService } from './matching-room.service';

describe('MatchingRoomController', () => {
  let controller: MatchingRoomController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchingRoomController],
      providers: [MatchingRoomService],
    }).compile();

    controller = module.get<MatchingRoomController>(MatchingRoomController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

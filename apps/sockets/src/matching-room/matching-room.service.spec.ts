import { Test, TestingModule } from '@nestjs/testing';
import { MatchingRoomService } from './matching-room.service';

describe('MatchingRoomService', () => {
  let service: MatchingRoomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MatchingRoomService],
    }).compile();

    service = module.get<MatchingRoomService>(MatchingRoomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

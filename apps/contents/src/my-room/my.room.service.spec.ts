import { Test, TestingModule } from '@nestjs/testing';
import { MyRoomService } from './my.room.service';

describe('MyRoomService', () => {
  let service: MyRoomService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MyRoomService],
    }).compile();

    service = module.get<MyRoomService>(MyRoomService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { MyRoomGateway } from './my-room.gateway';
import { MyRoomService } from './my-room.service';

describe('MyRoomGateway', () => {
  let gateway: MyRoomGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MyRoomGateway, MyRoomService],
    }).compile();

    gateway = module.get<MyRoomGateway>(MyRoomGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});

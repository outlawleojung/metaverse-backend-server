import { Test, TestingModule } from '@nestjs/testing';
import { MyRoomController } from './my.room.controller';

describe('MyRoomController', () => {
  let controller: MyRoomController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MyRoomController],
    }).compile();

    controller = module.get<MyRoomController>(MyRoomController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

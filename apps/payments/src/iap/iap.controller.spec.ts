import { Test, TestingModule } from '@nestjs/testing';
import { IapController } from './iap.controller';

describe('IapController', () => {
  let controller: IapController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IapController],
    }).compile();

    controller = module.get<IapController>(IapController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

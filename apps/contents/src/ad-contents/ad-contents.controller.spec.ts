import { Test, TestingModule } from '@nestjs/testing';
import { AdContentsController } from './ad-contents.controller';

describe('AdContentsController', () => {
  let controller: AdContentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdContentsController],
    }).compile();

    controller = module.get<AdContentsController>(AdContentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

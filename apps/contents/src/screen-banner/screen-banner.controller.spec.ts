import { Test, TestingModule } from '@nestjs/testing';
import { ScreenBannerController } from './screen-banner.controller';

describe('ScreenBannerController', () => {
  let controller: ScreenBannerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScreenBannerController],
    }).compile();

    controller = module.get<ScreenBannerController>(ScreenBannerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { ScreenBannerGateway } from './screen-banner.gateway';

describe('ScreenBannerGateway', () => {
  let gateway: ScreenBannerGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScreenBannerGateway],
    }).compile();

    gateway = module.get<ScreenBannerGateway>(ScreenBannerGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});

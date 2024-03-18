import { Test, TestingModule } from '@nestjs/testing';
import { ScreenBannerService } from './screen-banner.service';

describe('ScreenBannerService', () => {
  let service: ScreenBannerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScreenBannerService],
    }).compile();

    service = module.get<ScreenBannerService>(ScreenBannerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { AdContentsService } from './ad-contents.service';

describe('AdContentsService', () => {
  let service: AdContentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdContentsService],
    }).compile();

    service = module.get<AdContentsService>(AdContentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

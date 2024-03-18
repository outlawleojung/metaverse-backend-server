import { Test, TestingModule } from '@nestjs/testing';
import { IapService } from './iap.service';

describe('IapService', () => {
  let service: IapService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IapService],
    }).compile();

    service = module.get<IapService>(IapService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

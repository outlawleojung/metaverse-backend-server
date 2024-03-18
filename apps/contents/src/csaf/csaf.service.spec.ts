import { Test, TestingModule } from '@nestjs/testing';
import { CsafService } from './csaf.service';

describe('CsafService', () => {
  let service: CsafService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CsafService],
    }).compile();

    service = module.get<CsafService>(CsafService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

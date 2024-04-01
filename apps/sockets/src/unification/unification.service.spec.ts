import { Test, TestingModule } from '@nestjs/testing';
import { UnificationService } from './unification.service';

describe('UnificationService', () => {
  let service: UnificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UnificationService],
    }).compile();

    service = module.get<UnificationService>(UnificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { SelectVoteService } from './select-vote.service';

describe('SelectVoteService', () => {
  let service: SelectVoteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SelectVoteService],
    }).compile();

    service = module.get<SelectVoteService>(SelectVoteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
